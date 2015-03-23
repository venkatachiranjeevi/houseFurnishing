import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect


def estimator(request):
    return render(request, "template1/home.html")

@csrf_protect
def register(request):
    data=request.POST['x'];
    dat=json.loads(data);
    return render(request, "template1/roomDetails.html",{"dat":dat})