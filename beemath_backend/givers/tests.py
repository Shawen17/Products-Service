from django.test import TestCase, Client, RequestFactory
from givers.models import Product,DestinationCharge,User
from django.http import HttpRequest
from givers.views import giveaway_api


class TestProductModel(TestCase):

    def setUp(self):
        self.data1= Product.objects.create(description='black tommy polo',category='clothes',detail='size 8, female polo top',quantity=5,price=2200,status='unpicked')

    def test_Product_model_entry(self):
        data=self.data1
        self.assertEqual(str(data),'black tommy polo')

class TestProductList(TestCase):
    def setUp(self):
        self.c=HttpRequest()
        self.factory =RequestFactory()
        Product.objects.create(description='black tommy polo',category='clothes',detail='size 8, female polo top',quantity=5,price=2200,status='unpicked',in_stock=True)
        User.objects.create(email='abc@yahoo.com',password='seunhwfar',first_name='seun',last_name='shawen')

    def test_product_display(self):
        request = self.factory.get('/api/giveaway/')
        response=giveaway_api(request)
        html= response.content.decode('utf8')
        print(html)
        