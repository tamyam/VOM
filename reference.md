# VOM reference
VOM JavaScript Library reference

## get element
- *elem* = VOM(*selector*)
- *elem* = VOM.id(*id*)
- *elem* = VOM.class(*class*)
- *elem* = VOM.name(*name*)
- *elem* = VOM.tag(*tagname*, *namespace*?)
- *elem* = VOM.query(*selector*)

## create element
- *elem* = VOM.createElem(*tagname*, *namespace*?)
- *text* = VOM.createText(*text*)

## object operation
- *type* = VOM.type(*type*)
- *obj* = VOM.clone(*obj*)

## find element
- *elem* = *elem*.find(*selector*)
- *elem* = *elem*.findClass(*class*)
- *elem* = *elem*.findTag(*tagname*, *namespace*?)
- *elem* = *elem*.findQuery(*selector*)

## element operation
### attr
- *attr* = *elem*.attr(*name*)
- *elem*.attr(*name*, *value*)
- *elem*.attr(*obj*)

### html
- *html* = *elem*.html()
- *elem*.html(*html*)
- *html* = *elem*.innerHTML
- *elem*.innerHTML = *html*

### value
There was an error in the past reference (1.0‐1.1)
- *value* = *elem*.val()
- *elem*.val(*value*)
- *value* = *elem*.value
- *elem*.value = *value*

### event
- *elem*.on(*type*, *listener*, *options*?)
- *elem*.off(*type*, *listener*, *options*?)

### class
- *elem*.addClass(*...class*)
- *elem*.removeClass(*...class*)
- *elem*.hasClass(*class*)
- *elem*.toggleClass(*...class*, *force*?)
- *classAttr* = *elem*.className
- *elem*.className = *classAttr*

### css
- *value* = *elem*.css(*name*)
- *elem*.css(*name*, *value*)
- *elem*.css(*obj*)

### index
- *elem* = *elem*.index(*index*)

### addChild
- *elem*.append(*...child*)
- *elem*.prepend(*...child*)

### parent
- *parent* = *elem*.parent()

### remove
- *elem*.remove()

## ArrayLike operation
- forEach
- pop
- push
- reverse
- shift
- unshift
