# REDIRECTS.md — карта редиректов

Старые страницы enzoo24.ru → новые маршруты (301/308, permanent). Правила уже описаны в `src/config/redirects.ts` и сработают, если старый домен будет направлен на новый сайт. Перенос домена выполняется отдельно, при наличии доступа.

| Старый адрес (enzoo24.ru) | Новый маршрут |
|---|---|
| `/home/` | `/` |
| `/home/terapiya/` | `/services/therapy` |
| `/home/surgery/` | `/services/surgery` |
| `/home/castration/` | `/services/castration` |
| `/home/vaccination/` | `/services/vaccination` |
| `/home/laboratoriya/` | `/services/laboratory` |
| `/home/hospital/` | `/services/hospital` |
| `/home/stomatologiya/` | `/services/dentistry` |
| `/home/oftalmologiya/` | `/services/ophthalmology` |
| `/home/gruming/` | `/grooming` |
| `/home/rentgen/` | `/services/xray` |
| `/home/uzi/` | `/services/ultrasound` |
| `/home/onko/` | `/services/oncology` |

Внутренний редирект: `/services/grooming` → `/grooming` (груминг имеет собственный маршрут).

enzoovet.ru — одностраничный сайт; его якоря (`#services`, `#contact` и т. д.) сервер не получает, отдельные правила не нужны. Если домен enzoovet.ru будет переведён на новый сайт, главная `/` откроется по тому же адресу.
