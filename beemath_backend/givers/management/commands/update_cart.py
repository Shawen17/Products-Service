from django.core.management.base import BaseCommand
from givers.models import ShoppingCart,ProductVariation
from datetime import timedelta
from django.utils import timezone






class Command(BaseCommand):
    help = 'remove overdue items from cart'

    def handle(self, *args, **kwargs):

        now = timezone.now()
        cart = ShoppingCart.objects.filter(status='in-cart',updated__lte=now-timedelta(minutes=30))
        if cart:
            ids=[]
            qty=[]
            for prod in cart:
                ids.append(prod.product.id)
                qty.append(prod.quantity)
            for i,quantity in zip(ids,qty):
                product=ProductVariation.objects.get(id=i)
                product.quantity=quantity+product.quantity
                product.save(update_fields=['quantity'])
            cart.delete()