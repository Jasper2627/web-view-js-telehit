telehit_menu([{
    "home":[
        {
            "Name": "Home",
            "link": "http://www.telehit.com/",
            "jsonp": "http://localhost/~carlos.gutierrez/repositorios/web-view-js-telehit/feedsTelehit/telehit.mixth.js",
            "type": "mix",
            "callback": "telehit_home"
        }
     ],   
    "videos":
        {
            "Name": "Videos telehit",
            "link": "http://www.telehit.com/videos",
            "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/programas/telehit-programas_guerrachistes-jsonp_local.js",
            "callback": "telehit_video"
            
        },
    "noticias":
        {
            "Name": "Noticias telehit",
            "link": "http://www.telehit.com/noticias",
            "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/noticias/telehit-noticias-jsonp_local.js",
            "stage": "http://i2.esmas.com/apps/telehit/maraton_telehit.jpg",
            "callback": "telehit_noticias"
        }, 
    "premios":
        {
            "Name": "Telehit",
            "link": "http://premios.telehit.com/",
            "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/premios/telehit_premios-jsonp_respaldo.js",
            "stage": "http://i2.esmas.com/apps/telehit/claudio.jpg",
            "callback": "ptelehit_videos"
        }, 
    "programas":[
            {
                "Name": "Guerra de Chistes",
                "link": "http://www.telehit.com/programas/guerra-chistes/",
                "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/programas/telehit-programas_decercka-respaldo.js",
                "img": "http://localhost/telehit/jQuery.appTelehit/img/guerra_de_chistes.jpg",
                "stage": "http://i2.esmas.com/apps/telehit/guerra_chistes.jpg",
                "callback": "telehit_video"
            },
            {
                "Name": "Show de Ceci TV",
                "link": "http://www.telehit.com/programas/show-ceci-tv/",
                "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/programas/telehit-programas_showceci-jsonp_respaldo.js",
                "img": "http://localhost/telehit/feedsTelehit/show_de_ceci.jpg",
                "stage": "http://i2.esmas.com/apps/telehit/ceci.jpg",
                "callback": "telehit_video"
            },
            {
                "Name": "Picnic ",
                "link": "http://www.telehit.com/programas/picnic/",
                "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/programas/telehit-programas_picnic-jsonp_respaldo.js",
                "img": "http://localhost/telehit/feedsTelehit/el_picnic.jpg",
                "stage": "http://i2.esmas.com/apps/telehit/picnic.jpg",
                "callback": "telehit_video"
            },
            {
                "Name": "El Show de Oscar Burgos",
                "link": "http://www.telehit.com/programas/show-oscar-burgos/",
                "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/programas/telehit-programas_showoscarburgos-jsonp_respaldo.js",
                "img": "http://localhost/telehit/feedsTelehit/show_de_oscar_burgos.jpg",
                "stage": "http://i2.esmas.com/apps/telehit/showOscarBurgos.jpg",
                "callback": "telehit_video"

            },            
            {
                "Name": "De Cerka",
                "link": "http://www.telehit.com/programas/cerka/",
                "jsonp": "http://localhost/telehit/jQuery.appTelehit/feeds/programas/telehit-programas_decercka-respaldo.js",
                "img": "http://localhost/telehit/feedsTelehit/de_cerka_karla_gomez.jpg",
                "stage": "http://i2.esmas.com/apps/telehit/de_cerka.jpg",
                "callback": "telehit_video"
            }           
        ]
}])