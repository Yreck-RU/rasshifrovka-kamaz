(function (w, d, s, h, id) {
    w.roistatProjectId = id; w.roistatHost = h;
    var p = d.location.protocol == "https:" ? "https://" : "http://";
    var u = /^.*roistat_visit=[^;]+(.*)?$/.test(d.cookie) ? "/dist/module.js" : "/api/site/1.0/" + id + "/init?referrer=" + encodeURIComponent(d.location.href);
    var js = d.createElement(s); js.charset = "UTF-8"; js.async = 1; js.src = p + h + u; var js2 = d.getElementsByTagName(s)[0]; js2.parentNode.insertBefore(js, js2);
})(window, document, 'script', 'cloud.roistat.com', 'bd8a9cfc45f99746289f672da01168ba');

(function (w, d, s, h) {
    w.roistatWithJivoSiteIntegrationWebHook = 'https://cloud.roistat.com/integration/webhook?key=894d6d09d5131ae0bac18fd571699f2c';
    var p = d.location.protocol == "https:" ? "https://" : "http://";
    var u = "/static/marketplace/JivoSite/script.js";
    var js = d.createElement(s); js.async = 1; js.src = p + h + u; var js2 = d.getElementsByTagName(s)[0]; js2.parentNode.insertBefore(js, js2);
})(window, document, 'script', 'cloud.roistat.com');

(function () {
    if (window.roistat !== undefined) {
        handler();
    } else {
        var pastCallback = typeof window.onRoistatAllModulesLoaded === "function" ? window.onRoistatAllModulesLoaded : null;
        window.onRoistatAllModulesLoaded = function () {
            if (pastCallback !== null) {
                pastCallback();
            }
            handler();
        };
    }

    function handler() {
        function init() {
            appendMessageToLinks();

            var delays = [1000, 5000, 15000];
            setTimeout(function func(i) {
                if (i === undefined) {
                    i = 0;
                }
                appendMessageToLinks();
                i++;
                if (typeof delays[i] !== 'undefined') {
                    setTimeout(func, delays[i], i);
                }
            }, delays[0]);
        }

        function replaceQueryParam(url, param, value) {
            var explodedUrl = url.split('?');
            var baseUrl = explodedUrl[0] || '';
            var query = '?' + (explodedUrl[1] || '');
            var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
            var queryWithoutParameter = query.replace(regex, "$1").replace(/&$/, '');
            return baseUrl + (queryWithoutParameter.length > 2 ? queryWithoutParameter + '&' : '?') + (value ? param + "=" + value : '');
        }

        function appendMessageToLinks() {
            var message = 'Обязательно отправьте это сообщение и дождитесь ответа. Ваш номер: {roistat_visit}';
            var text = message.replace(/{roistat_visit}/g, window.roistatGetCookie('roistat_visit'));
            text = encodeURI(text);
            var linkElements = document.querySelectorAll('[href*="//wa.me"], [href*="//api.whatsapp.com/send"], [href*="//web.whatsapp.com/send"], [href^="whatsapp://send"]');
            for (var elementKey in linkElements) {
                if (linkElements.hasOwnProperty(elementKey)) {
                    var element = linkElements[elementKey];
                    element.href = replaceQueryParam(element.href, 'text', text);
                }
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    };
})();