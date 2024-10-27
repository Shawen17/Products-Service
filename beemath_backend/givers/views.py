from django.shortcuts import render
import json
from django.contrib.auth import get_user_model
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .serializers import (DestinationChargeSerializer,OrderSerializer,
    ContactUsSerializer,ShoppingCartSerializer,HomePageVideoSerializer,ProductVariationSerializer)
from .models import DestinationCharge,Order,ShoppingCart,HomePageVideo,Store,ProductVariation


User=get_user_model()


def home(request):
    return render(request,'index.html')




@api_view(['GET'])
def product_api(request):
    if request.method=='GET':
        try:
            products=ProductVariation.objects.filter(in_stock=True,product__is_active=True).order_by('-updated')
            serializer=ProductVariationSerializer(products,many=True)
            return Response(serializer.data,content_type='application/json')
        except Exception as e:
            print(f"Error during product_api get: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT','GET'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    data=request.data
    if request.method == "PUT":
        item=ShoppingCart.objects.get(id=data['product_id'],shopper=data['email'],status='in-cart')
        prod=item.product
        refill=item.quantity
        try:
            with transaction.atomic():
                product=ProductVariation.objects.select_for_update().get(id=prod.id)
                product.quantity+=refill
                product.save(update_fields=['quantity'])
                item.delete()
                return Response(status=status.HTTP_201_CREATED)
        except Exception:
            return Response({"status": status.HTTP_500_INTERNAL_SERVER_ERROR, "message": "Something went wrong."})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def get_destination(request):
    data=request.data
    unordered_cart_items=ShoppingCart.objects.filter(shopper=data['email'],status='in-cart')
    amount=unordered_cart_items.aggregate(total=Sum('cost'))
    if request.method== 'PUT':
        try:
            destinations=DestinationCharge.objects.all()
            serializer=DestinationChargeSerializer(destinations,many=True)
            return Response({"areas":serializer.data,'amount':amount})
        except Exception as e:
            print(f"Error fetching destination: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def update_cart_items(request):
    data=request.data
    if request.method == "PUT":
        try:
            with transaction.atomic():
                product=ProductVariation.objects.select_for_update().get(id=data['product_id'])
                cart_data={
                    "shopper":data['email'],
                    "product":product,
                    "quantity": int(data['quantity']),
                    "cost": int(data['quantity'])*product.price
                }

                if product.in_stock and product.product.is_active:
                    if int(data['quantity']) > product.quantity:
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                    ShoppingCart.objects.create(**cart_data)
                    product.quantity -= int(data['quantity'])
                    product.save(update_fields=['quantity'])
                    return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error Updating cart items: {e}")
            return Response({"status": status.HTTP_500_INTERNAL_SERVER_ERROR, "message": "Something went wrong."})


@api_view(['PUT'])
def update_multi_cart_items(request):
    data=request.data
    if request.method == "PUT":
        product_quantity_pair= zip(data['product_id'],data['quantity'])
        try:
            with transaction.atomic():

                for i,qty in product_quantity_pair:
                    product=ProductVariation.objects.select_for_update().get(id=i)

                    cart_data={
                        "shopper":data['email'],
                        "product":product,
                        "quantity": qty,
                        "cost": qty*product.price
                    }

                    if product.in_stock and product.product.is_active:
                        if qty > product.quantity:
                            return Response({"status":status.HTTP_400_BAD_REQUEST,"message":"Not enough quantity"})
                        ShoppingCart.objects.create(**cart_data)
                        product.quantity -= qty
                        product.save(update_fields=['quantity'])
                return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f'Error Updating multi-cart: {e}')
            return Response({"status": status.HTTP_500_INTERNAL_SERVER_ERROR, "message": "Something went wrong."})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def display_cart_items(request):
    data=request.data
    if request.method == "PUT":
        try:
            unordered_cart_items=ShoppingCart.objects.filter(shopper=data['email'],status='in-cart')
            count=unordered_cart_items.aggregate(total=Sum('quantity'))
            serializer=ShoppingCartSerializer(unordered_cart_items,many=True)
            return Response({"products":serializer.data,"count":count})
        except Exception as e:
            print(f'Error during cart display: {e}')
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    from .utility import remove
    data=request.data
    try:
        with transaction.atomic():
            items=data['item'].split(',')
            products=remove(items)
            product_ids= []
            for prod,var in products:
                if var=='':
                    var=None
                product_ids.append(ProductVariation.objects.get(product__description=prod,variant=var).id)

            ordered=ShoppingCart.objects.filter(shopper=data['ordered_by'],product__in=product_ids,status='in-cart')
            for j in ordered:
                store=Store.objects.select_for_update().get(variant=j.product.id)
                store.unit_sold+=j.quantity
                store.save(update_fields=['unit_sold'])
            ordered.delete()
            return Response(status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f'Error initiating payment: {e}')
        return Response({"status": status.HTTP_500_INTERNAL_SERVER_ERROR, "message": "Something went wrong."})


@api_view(['PUT'])
def client_orders(request):
    from .utility import remove
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            items = data.get('products', [])
            if not items:
                return Response({"error": "No products provided"}, status=status.HTTP_400_BAD_REQUEST)
            # Process items
            categories = []
            prod_desc = []
            products = remove(items)
            for prod, var in products:
                if var == '':
                    var = None
                try:
                    category = ProductVariation.objects.get(product__description=prod, variant=var)
                    if category.product.description not in prod_desc:
                        prod_desc.append(category.product.description)
                        categories.append(category.product.category)
                except ProductVariation.DoesNotExist:
                    continue 

            # Fetch products by categories
            products = ProductVariation.objects.filter(product__category__in=categories ).exclude(product__description__in=prod_desc)
            product_serializer = ProductVariationSerializer(products, many=True)
            return Response({"products": product_serializer.data}, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def contact_us(request):
    data=request.data
    serializer=ContactUsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def recently_added(request):
    recent = HomePageVideo.objects.all().order_by('-updated')
    cart=ShoppingCart.objects.filter(status='ordered').order_by('-quantity')[:6]
    cart_items=[i.product.id for i in cart]
    top_selling=ProductVariation.objects.filter(id__in=cart_items,product__is_active=True)
    sales=ProductVariation.objects.filter(product__on_sales=True,product__is_active=True,in_stock=True)
    all_products=ProductVariation.objects.filter(product__is_active=True,in_stock=True)
    all_products_serializer=ProductVariationSerializer(all_products,many=True)
    sales_serializer=ProductVariationSerializer(sales,many=True)
    top_selling_serializer=ProductVariationSerializer(top_selling,many=True)
    serializer=HomePageVideoSerializer(recent,many=True)
    return Response({'recent':serializer.data,'top':top_selling_serializer.data,'sales':sales_serializer.data,'all':all_products_serializer.data})







