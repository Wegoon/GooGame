from django.http import JsonResponse

def apply_code(request):
    appid = "1904"
    return JsonResponse({
        'result': "success"
    })