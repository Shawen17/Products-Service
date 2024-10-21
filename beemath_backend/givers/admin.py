from django.contrib import admin
from .models import User,Product,DestinationCharge,Order,ContactUs,Category,ShoppingCart,HomePageVideo, Store,ProductVariation
from django.contrib.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _



@admin.register(Store)
class StoreAdmin(ModelAdmin):
    list_display=('variant','total','unit_sold','unit_added')
    readonly_fields=('total','unit_sold',)



@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name','state')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )

    list_display=['email','first_name','last_name','state']
    ordering=('email',)


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display= ('description','category','detail','slug','on_sales','is_active','uploaded')
    search_fields=('category','description')
    list_filter=('is_active',)
    ordering=('category',)
    actions = ['mark_inactive','mark_on_sales','remove_from_sales']
    prepopulated_fields={'slug':['description']}

    def mark_inactive(self,request,queryset):
        queryset.update(is_active=False)

    def mark_on_sales(self,request,queryset):
        queryset.update(on_sales=True)

    def remove_from_sales(self,request,queryset):
        queryset.update(on_sales=False)

    remove_from_sales.short_description='Remove from Sales'
    mark_on_sales.short_description='Mark for Flash Sale'
    mark_inactive.short_description='Mark as Inactive'


@admin.register(ProductVariation)
class ProductVariationAdmin(ModelAdmin):
    list_display= ('product','updated','variant','price','quantity','in_stock')
    search_fields=('variant',)
    list_filter=('in_stock',)
    ordering=('-updated',)
    readonly_fields=('quantity',)
    actions = ['mark_inactive','mark_on_sales','remove_from_sales']


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display= ('name','slug')
    prepopulated_fields={'slug':['name']}



@admin.register(DestinationCharge)
class DestinationChargeAdmin(ModelAdmin):
    list_display=('state','city','charge','door_delivery_charge','zone')
    actions=['export_rate']
    ordering=('zone',)

    def export_rate(self,request,queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders.csv"'
        writer = csv.writer(response)
        writer.writerow(['Destination','Charge'])
        orders = queryset.values_list('city','charge')
        for order in orders:
            writer.writerow(order)
        return response
    export_rate.short_description = 'Export to csv'




@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display=('ref','item','ordered_by','ordered_on','delivery_address','zone','contact_number','amount','paid','packed','delivered')
    actions=['mark_paid','mark_packed']
    ordering=('-ordered_on','zone')
    list_filter=('zone',)
    search_fields=('ref','zone')

    def mark_paid(self,request,queryset):
        queryset.update(paid=True)

    def mark_packed(self,request,queryset):
        queryset.update(packed=True)

    def mark_delivered(self,request,queryset):
        queryset.update(delivered=True)

    mark_paid.short_description= 'Mark as paid'
    mark_packed.short_description='Mark as packed'
    mark_delivered.short_description='Mark as delivered'



@admin.register(ContactUs)
class ContactUsAdmin(ModelAdmin):
    list_display=('email','ref','date_raised','subject','message','treated')


@admin.register(ShoppingCart)
class ShoppingCartAdmin(ModelAdmin):
    list_display=('shopper','updated','product','quantity','cost','status')


@admin.register(HomePageVideo)
class HomePageVideoAdmin(ModelAdmin):
    list_display=('title','poster','videofile','updated')
    ordering = ('-updated',)