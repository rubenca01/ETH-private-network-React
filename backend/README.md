# Table of contents

[/network/create](#networkcreate)

[/network/list](#networklist)


### /network/create <a name="networkcreate"></a>

**Method** POST

**Headers**

**Body** 

```json
                {
                    
                }
```

**Result**

    Response code 200

```json
                {
                    "network_id": 9999
                }
``` 

**Error codes**
| httpcode | Message |
|-----|-------|
| 500 | Internal Server Error |

```json
          { 
            error: "" 
          }
```

### /network/list <a name="networklist"></a>

**Method** GET

**Headers**

**Result**

    Response code 200

```json
                {
                    "networks": [
                        {
                        "number": "NETWORK1",
                        "chainid": "XXXXXXX",
                        "cuentas": {
                            "alloc": {
                            "704765a908962e25626f2bea8cdf96c84dedaa0b": {
                                "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
                            }
                            }
                        }
                        },
                        {
                        "number": "NETWORK2",
                        "chainid": "YYYYYYY",
                        "cuentas": {
                            "alloc": {
                            "704765a908962e25626f2bea8cdf96c84dedaa0b": {
                                "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
                            }
                            }
                        }
                        },
                        {
                        "number": "NETWORK2",
                        "chainid": "ZZZZZZZ",
                        "cuentas": {
                            "alloc": {
                            "704765a908962e25626f2bea8cdf96c84dedaa0b": {
                                "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
                            }
                            }
                        }
                        }
                    ]
                }
``` 

**Error codes**
| httpcode | Message |
|-----|-------|
| 500 | Internal Server Error |

```json
          { 
            error: "" 
          }
```



**utils**

https://scriptcrunch.com/enable-docker-remote-api/

yarn add dockerode -> node minimun version Node.js v14