from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product,DestinationCharge,Order,ContactUs,ShoppingCart,HomePageVideo,ProductVariation

User=get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields= ('id','first_name','last_name','email','state','password')


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model=Product
        fields=('id','description','image','category','detail','slug','is_active','videofile')

class ProductVariationSerializer(serializers.ModelSerializer):
    description=serializers.CharField(source='product.description')
    image=serializers.ImageField(source='product.image')
    video=serializers.FileField(source='product.videofile')
    category=serializers.CharField(source='product.category')
    detail=serializers.CharField(source='product.detail')
    class Meta:
        model=ProductVariation
        fields=('id','description','image','category','detail','variant','quantity','price','video')


class DestinationChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model=DestinationCharge
        fields=('id','state','city','charge','door_delivery_charge','zone')


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields=('id','ref','item','ordered_on','ordered_by','contact_number','delivery_address','amount','delivered','zone')


class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields =('id','email','ref','subject','message')


class ShoppingCartSerializer(serializers.ModelSerializer):
    product_description=serializers.CharField(source='product')
    product_price=serializers.IntegerField(source='product.price')
    product_image=serializers.ImageField(source='product.product.image')


    class Meta:
        model= ShoppingCart
        fields=('id','shopper','quantity','cost','product_description','product_price','product_image')


class HomePageVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePageVideo
        fields=('id','title','poster','videofile')