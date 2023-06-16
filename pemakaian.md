Halo, ini adalah github repository Estetikin by Adrian dan Evan untuk backend-services

coba POST
http://localhost:5000/auth/register

input json
{
"name":"jason123",
"email":"adrian19@gmail.com",
"password":"keren123",
"passwordConfirm":"keren123"
}

coba login
http://localhost:5000/auth/login

endpoitn articles:
dia dibuat pake request params untuk jenisnya

- {baseurl}/articles/android
- {baseurl}/articles/all
- {baseurl}/articles/ios
- {baseurl}/articles/dslr
- {baseurl}/articles/video

Format Json returnnya
{
message : 'berisi kapana diupdate terakhir',
error : true/false
data : [list of data]
}
