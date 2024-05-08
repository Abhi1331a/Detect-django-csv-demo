from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import FileSystemStorage
from .models import CSVFiles
import pandas as pd
import plotly.express as px

# Create your views here.
@api_view(['POST'])
def csvhandler(request):
    try:
        if request.method == "POST":
            file = request.FILES['myFile']  # get the uploaded file
            fs = FileSystemStorage(location='assets')  # specify the location to save the file
            filename = fs.save(file.name, file)  # save the file
            file_url = fs.url(filename)  # get the file url

            # save to sqlitwe
            my_model = CSVFiles(filename=filename, path="assets"+file_url) 
            my_model.save()
            return Response("CSV Saved", status=status.HTTP_200_OK)
        return Response('Unsupported Method', status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("CSV not saved", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['GET'])
def getFiles(request):
    try:
        print(request)
        if request.method == "GET":
            files = CSVFiles.objects.all()
            modified_files = []

            for file in files:
                df = pd.read_csv(file.path)  # Assuming 'path' is a field in your model
                columns = list(df.columns)
                modified_files.append({'id': file.id, 'filename': file.filename,'path': file.path, 'columns': columns})
                # print(modified_files)
            return Response(modified_files, status=status.HTTP_200_OK)
        return Response('Unsupported Method', status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("CSV not saved", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def visualize(request):
    try:
        print(request)
        if request.method == "POST":
            df = pd.read_csv(request.data.path)
            if request.data.visualizationType == 'bar':
                
                return Response(   status=status.HTTP_200_OK)
            elif request.data.visualizationType == 'pie':
                return Response(   status=status.HTTP_200_OK)
            else:
                return Response('Unsupported Visualization Type', status=status.HTTP_400_BAD_REQUEST)
        return Response('Unsupported Method', status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response("CSV not saved", status=status.HTTP_500_INTERNAL_SERVER_ERROR)