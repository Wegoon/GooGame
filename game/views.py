from django.http import HttpResponse

def index(request):
    line1 = '<h1 style = "text-align : center">我的第一个网页！！！</h1>'
    line2 = '<center><img src = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg95.699pic.com%2Fphoto%2F40174%2F2421.gif_wh300.gif&refer=http%3A%2F%2Fimg95.699pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1649913980&t=059cd91ed2051450cd586d173369f4bc" width=800></center>'
    return HttpResponse(line1 + line2)
