from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('CostEstimator.views',
    # Examples:
    # url(r'^$', 'houseFurnishing.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^homedecorator$','estimator'),
    url(r'^register$', 'register'),
    url(r'^admin/', include(admin.site.urls)),
)
