module.exports.DB_CONFIG = {
    REDIS: {
        host: '127.0.0.1',
        port: '6379',
        password: null,
        buckets:{
            homepage:{
                db:1,
                ttl:3600
            },
            category:{
                db:2,
                ttl:3600
            },
            brand:{
                db:3,
                ttl:3600
            },
            product:{
                db:4,
                ttl:3600
            },
            brandcategory:{
                db:5,
                ttl:3600
            },
            static:{
                db:6,
                ttl:3600
            }
        }
    }
}
