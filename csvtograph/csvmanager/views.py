from django.shortcuts import render

# Create your views here.
def csvhandler(request):
    return HTTPResponse("CSV Saved")