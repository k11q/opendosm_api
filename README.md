# OpenDOSM Unofficial Public API

This is a public API of openDOSM datasets:

Base url:

```
https://opendosmapi-production.up.railway.app/api/
```

There is ``bucket`` and ``file_name``

The api works this way:

```
https://opendosmapi-production.up.railway.app/api/${bucket}/${file_name}
```

## Example

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

## Data From Aksara Data

Datasets from Aksara Data repo are also available(which includes metadata, variables, etc...)

The API behaves like the repo data structure, where theres ``catalog`` and ``data``.

This is how they are structured:

catalog (basename)
 | data1.json (file_name)
 | data2.json (file_name)

data (basename)
 | data1.json (file_name)
 | data2.json (file_name)

The API works this way:

```
https://opendosmapi-production.up.railway.app/api/${basename}/${file_name}
```

Example:

for getting the ``/catalog/data1.json`` json:

```
https://opendosmapi-production.up.railway.app/api/catalog/data1
```
