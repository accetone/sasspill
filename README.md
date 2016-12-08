## SASSPILL

*Yet Another Online Sass Compiler*

#### Key features

- compile SASS
- made it online
- ...
- PROFIT!

#### Endpoint

You can use `sasspill` as external API to compile your SASS code.

```
POST https://sasspill.herokuapp.com/api/scss
```

In: 

```
files : object
- main : string
- [other keys] : string | optional

libs : object
- bourbon : boolean

transform : object | optional
- minify : boolean
- sourcemap : boolean
```

Out:

```
200 OK

css : string
map : string
```

```
500 Error

message : string
```
