This is a public API of openDOSM datasets:

Base url:

```
https://opendosmapi-production.up.railway.app/api/
```


Say the data you want is located in this csv:

```
https://storage.googleapis.com/dosm-public-economy/fuelprice.csv
```


The link would be:

```
https://opendosmapi-production.up.railway.app/api/dosm-public-economy/fuelprice
```

Columns filtering are supported.

E.g:

```
https://opendosmapi-production.up.railway.app/api/dosm-public-economy/fuelprice?columns=series_type,date,ron97
```

returns the columns for only
- series_type
- date
- ron97
