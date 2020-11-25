from django.shortcuts import render

# Create your views here.


def path_finding(request):
    return render(request, 'path_finding.html')
