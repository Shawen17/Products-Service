from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import UserManager
import secrets
from django.db.models.signals import post_save
from django.dispatch import receiver




states = (
    ("Lagos","Lagos"),
    ("Ogun","Ogun")
)





categories =(
    ('furniture','Furniture'),
    ('clothe','Clothes'),
    ('shoe','Shoes'),
    ('toy','toys'),
    ('electronics','Electronics'),
    ('bag','Bags'),
    ('mobile','mobile-phones'),
    ('bathroom','Bathroom'),
    ('tracker','Tracker'),
    ('kitchen','Kitchen'),
    ('household-accessories','Household-accessories'),
    ('accessories','Accessories'),
    ('beauty','Beauty'),

)

cart_choices=(
    ('in-cart','in-cart'),
    ('ordered','ordered')
)


zones=(
    ('',''),
    ('island zone A','island zone A'),
    ('island zone B','island zone B'),
    ('island zone B2','island zone B2'),
    ('mainland zone A','mainland zone A'),
    ('mainland zone B','mainland zone B'),
    ('mainland zone C','mainland zone C'),
    ('mainland zone D','mainland zone D'),
    ('mainland zone E','mainland zone E'),
)


class User(AbstractUser):
    username= None
    email=models.EmailField(_('email address'),unique=True)
    state=models.CharField(max_length=50,default='Lagos')

    objects=UserManager()

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['first_name','last_name','state','password']

    class Meta:
        verbose_name=_('user')
        verbose_name_plural=_('users')

    def __str__(self):
        return self.email


    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'

    def get_short_name(self):
        return self.first_name



class Category(models.Model):
    name=models.CharField(max_length=255)
    slug=models.SlugField(max_length=255,unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name



class Product(models.Model):
    description = models.CharField(max_length=50,blank=True,null=True,unique=True)
    category=models.CharField(max_length=50,blank=True,default='',choices=categories)
    image= models.ImageField(blank=True)
    videofile=models.FileField(null=True,blank=True)
    detail=models.TextField(max_length=200,blank=True,default='')
    slug=models.SlugField(max_length=255,unique=True,blank=True,null=True)
    uploaded=models.DateTimeField(auto_now_add=True)
    on_sales=models.BooleanField(default=False)
    is_active=models.BooleanField(default=True)


    def __str__(self):
        return self.description


class ProductVariation(models.Model):
    variant=models.CharField(max_length=50,blank=True,null=True)
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='variant')
    updated=models.DateTimeField(auto_now=True)
    price=models.IntegerField(default=1000)
    quantity=models.IntegerField(default=0)
    in_stock=models.BooleanField(default=True)

    class Meta:
        unique_together = ["variant", "product"]

    def __str__(self):
        if self.variant:
            return f'{self.product.description}_{self.variant}'
        return f'{self.product.description}_'

    def save(self, *args, **kwargs):
        if self.quantity == 0:
            self.in_stock=False
        elif self.quantity>0:
            self.in_stock=True

        super().save(*args, **kwargs)

class DestinationCharge(models.Model):
    state=models.CharField(max_length=50,choices=states)
    city=models.CharField(max_length=244,blank=True,null=True)
    charge=models.IntegerField()
    door_delivery_charge=models.IntegerField(blank=True,null=True)
    zone=models.CharField(max_length=50,choices=zones,default='',blank=True,null=True)

    def __str__(self):
        return self.state



class Order(models.Model):
    ref=models.CharField(max_length=50,blank=True,null=True)
    item=models.JSONField(default=list,null=True)
    ordered_by=models.CharField(max_length=130,null=True)
    ordered_on=models.DateField(auto_now_add=True)
    delivery_address=models.TextField()
    contact_number=models.BigIntegerField()
    amount=models.IntegerField(null=True)
    paid=models.BooleanField(default=True)
    packed=models.BooleanField(default=False)
    delivered=models.BooleanField(default=False)
    zone=models.CharField(max_length=50,blank=True,null=True)


    def __str__(self):
        return self.ref

    def save(self, *args, **kwargs):
        while not self.ref:
            ref = secrets.token_urlsafe(16)
            object_with_similar_ref = Order.objects.filter(ref=ref)
            if not object_with_similar_ref:
                self.ref=ref
        super().save(*args, **kwargs)


class ContactUs(models.Model):
    email=models.EmailField()
    ref=models.CharField(max_length=40,blank=True,null=True)
    date_raised=models.DateTimeField(auto_now_add=True)
    subject=models.CharField(max_length=20)
    message=models.TextField()
    treated=models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Contact Us'

    def __str__(self):
        return self.email


class ShoppingCart(models.Model):
    shopper=models.CharField(max_length=100)
    updated=models.DateTimeField(auto_now=True)
    product=models.ForeignKey(ProductVariation,on_delete=models.CASCADE,related_name='shopping_cart')
    cost=models.IntegerField(blank=True,null=True)
    quantity=models.IntegerField()
    status=models.CharField(max_length=20, default='in-cart',choices=cart_choices)

    def __str__(self):
        return str(self.product)


class HomePageVideo(models.Model):
    title=models.CharField(max_length=100)
    poster=models.ImageField(blank=True)
    videofile=models.FileField(null=True)
    updated=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title + ": " + str(self.videofile)


class Store(models.Model):
    variant=models.OneToOneField(ProductVariation,on_delete=models.CASCADE,blank=True,null=True)
    total=models.IntegerField(default=0)
    unit_sold=models.IntegerField(default=0)
    unit_added=models.IntegerField(default=0)

    def __str__(self):
        return self.variant.product.description

    def save(self, *args, **kwargs):
        prod= ProductVariation.objects.get(variant=self.variant.variant,product=self.variant.product)
        prod.quantity += self.unit_added
        prod.save()
        self.total += self.unit_added
        self.unit_added = 0
        super().save(*args, **kwargs)

@receiver(post_save,sender=ProductVariation)
def create_store_profile(sender,instance,created,**kwargs):
    from django.core import serializers
    if created:
        Store.objects.create(variant=instance)



