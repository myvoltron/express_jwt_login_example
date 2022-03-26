# express_jwt_login_example

JWT는 클라이언트와 서버 사이 통신시 권한을 인가하기 위해 사용하는 토큰

우선 REST API에서 로그인은 일반적인 로그인과는 조금 다릅니다. 

왜냐하면 일반적인 로그인은 session을 통해 이루어지는데 서버는 접속중인 클라이언트를 이 session을 통해 관리합니다. 사이트에 접속하면 session에 해당 클라이언트가 기록되고 로그인을 하게 되면 해당 클라이언트가 로그인한 것을 저장하게 됩니다. 이후 해당 클라이언트는 로그인이 요구되는 정보에 접근할 수 있게 됩니다. 이 방식은 접속자수가 늘어나면 서버의 메모리 사용량이 증가하게 되고 성능에 영향을 미치게 됩니다.

REST API에서는 서버가 session을 가지지 않습니다. 대신에 토큰 인증방식을 사용하게 됩니다. 

로그인 API로 아이디와 패스워드가 일치함이 확인되면 서버는 토큰을 발행하게 되고, 로그인 후 이용 가능한 API들에는 유효한 토큰이 있어야만 사용이 가능합니다. 

이때 토큰은 당연히 위조하기가 어려워야하고 사용자를 인식할 수 있는 정보가 들어가 있어야합니다. 

이제 JWT(JSON Web Token)을 사용해서 이를 확인해봅시다.

### JWT의 구조를 알아보자

우선 JWT는 **Header, Payload, Signature** 로 구성되어 있다.

- Header는 어떤 알고리즘으로 암호화할지, 토큰은 어떤 타입을 쓸 것인지에 대한 정보가 담긴다.
- Payload에는 사용자 인증 관련 정보가 담긴다. 인증에 필요한 최소한의 데이터만 담자!
- Signature에서는 Header와 Payload를 암호화 시킨것을 합쳐서 서버에서 지정한 비밀키를 통해 암호화된 것이 저장된다.

→ 따라서 비밀키만 있다면 토큰의 검증과 복호화를 할 수 있다.

1. **Access Token만을 이용한 서버 인증 방식**
    - 사용자가 로그인을 합니다.
    - 서버에서 사용자를 확인 후, Access Token(JWT)에 권한 인증을 위한 정보를 Payload에 넣고 생성합니다.
    - 생성한 토큰을 클라이언트에 반환하고, 클라이언트는 이 토큰을 저장합니다.
    - 클라이언트는 권한 인증이 필요한 요청을 할 때마다 이 토큰을 헤더에 실어서 보냅니다.
    - 서버는 헤더의 토큰을 검증하고, Payload의 값을 디코딩하여 사용자의 권한을 확인하고 필요한 응답을 합니다.
    - 만약, 토큰이 유효하지 않거나 만료되었다면 새로 로그인을 해서 토큰을 발급받아야합니다.


이를 익스프레스를 통해서 구현을 해보았습니다. 

API 명세서는 다음과 같습니다. 
- [GET] /users 
    - 유저목록 조회
    
    request example

        URL : http://localhost:8084/users

        Body : N/A

    response example
    ```json
        {
            "success": true,
            "users": [
                {
                    "id": 2,
                    "email": "naver@naver.com",
                    "password": "$2b$10$sA2Urr8aYt54Y1JQw7FH0enBZyFuv/hQbOc26e2cOy0X14m0SZeVy",
                    "createdAt": "2022-03-23T10:20:49.000Z"
                },
                {
                    "id": 3,
                    "email": "naver@naver.com",
                    "password": "$2b$10$oawFj6lnKe7aRAVD6gXZ6eEs0ACn1m44mZhzd/ah4hBwGEeAvF2T2",
                    "createdAt": "2022-03-26T13:01:26.000Z"
                }
            ]
        }
    ``` 
- [GET] /users/:id
    - 유저 상세조회

    request example

        URL : http://localhost:8084/users/2

        Header : { 'Access-Token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhc2RmQG5hdmVyLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGExTnRqd3AuTkxlTEJYZ3E4Ny81Rk9VRHdRbUZzYm5PMEljdjlPdlUxT0hJNE1rRDllMGVtIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0yNlQxMzoxNjowOC4wMDBaIiwiaWF0IjoxNjQ4MzAwOTQzLCJleHAiOjE2NDgzMDEwMDN9.5bFJIUkMJYHDwq2VaxVcNdBk1vSmpqvnzF9QLGeLp8A' }

        Body : N/A

    response example
    ```json
        {
            "success": true,
            "user": [
                {
                    "id": 2,
                    "email": "naver@naver.com",
                    "password": "$2b$10$sA2Urr8aYt54Y1JQw7FH0enBZyFuv/hQbOc26e2cOy0X14m0SZeVy",
                    "createdAt": "2022-03-23T10:20:49.000Z"
                }
            ]
        }
    ```
- [POST] /users
    - 회원가입

    request example

        URL : http://localhost:8084/users

        Body : { 'email' : 'asdf@naver.com', 'password': 'asdf' }

    response example
    ```json
    {
        "success": true,
        "insertId": 4
    }
    ```
- [PUT] /users/:id
    - 유저 수정

    request example

        URL : http://localhost:8084/users/3

        Header : { 'Access-Token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhc2RmQG5hdmVyLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGExTnRqd3AuTkxlTEJYZ3E4Ny81Rk9VRHdRbUZzYm5PMEljdjlPdlUxT0hJNE1rRDllMGVtIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0yNlQxMzoxNjowOC4wMDBaIiwiaWF0IjoxNjQ4MzAwOTQzLCJleHAiOjE2NDgzMDEwMDN9.5bFJIUkMJYHDwq2VaxVcNdBk1vSmpqvnzF9QLGeLp8A' }

        Body : { 'email': 'asdf123@naver.com' }

    response example
    ```json
    {
        "success": true
    }
    ```
- [DELETE] /users/:id
    - 유저 탈퇴

    request example

        URL : http://localhost:8084/users/3

        Header : { 'Access-Token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhc2RmQG5hdmVyLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGExTnRqd3AuTkxlTEJYZ3E4Ny81Rk9VRHdRbUZzYm5PMEljdjlPdlUxT0hJNE1rRDllMGVtIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0yNlQxMzoxNjowOC4wMDBaIiwiaWF0IjoxNjQ4MzAwOTQzLCJleHAiOjE2NDgzMDEwMDN9.5bFJIUkMJYHDwq2VaxVcNdBk1vSmpqvnzF9QLGeLp8A' }

        Body : N/A

    response example
    ```json
    {
        "success": true
    }
    ```
- [POST] /auth/login
    - 로그인

    request example

        URL : http://localhost:8084/auth/login

        Body : { 'email': 'asdf@naver.com', 'password': 'asdf' }

    response example
    ```json
    {
        "success": true,
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJhc2RmQG5hdmVyLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGExTnRqd3AuTkxlTEJYZ3E4Ny81Rk9VRHdRbUZzYm5PMEljdjlPdlUxT0hJNE1rRDllMGVtIiwiY3JlYXRlZEF0IjoiMjAyMi0wMy0yNlQxMzoxNjowOC4wMDBaIiwiaWF0IjoxNjQ4MzAwNTg0LCJleHAiOjE2NDgzMDA2NDR9.PCKyeoueKsT_JnJEy83OKaxbmzSdVEMp1IrkN_rUBgw"
    }
    ```
