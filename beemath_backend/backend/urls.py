
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from  django.conf import settings
from givers import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/products/',views.product_api,name='giveaway_api'),
    path('api/checkout/',views.get_destination,name='get_destination'),
    path('api/cart/remove/',views.remove_from_cart,name='remove_from_cart'),
    path('api/update/cart/',csrf_exempt(views.update_cart_items),name='update_cart_items'),
    path('api/update/multicart/',csrf_exempt(views.update_multi_cart_items),name='update_multi_cart_items'),
    path('api/cart/display/',views.display_cart_items,name='display_cart_items'),
    path('api/initiate-payment/',views.initiate_payment,name='initiate-payment'),
    path('api/orders/',views.client_orders,name='client_orders'),
    path('api/contact-us/',views.contact_us,name='contact-us'),
    path('api/recent/addition/',views.recently_added,name='recently_added'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root= settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,document_root= settings.STATIC_ROOT)
