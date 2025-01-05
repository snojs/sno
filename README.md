# # snojs *

> Building the web [your way](#your)
>
> _v4 snocrystal_

Build Declarative UIs without ever leaving your HTML.

```html
<div data='{count:1,update:setInterval(()=>{$("count++")},100)}'>
  <p react>
    {{count}}
  </p><br/>
  <button onclick="$('clearInterval(update)')">
    Stop
  </button>
</div>
```

## ## With attributes like

1. **data**
2. **if**
3. **click**
4. **for**
5. **react**
6. **incl**
7. **eval**

## ## 3.9kb Build

**sno** is as tiny as you need with less than __300*__ lines of JS<br/>
_Use less JavaScript write more HTML_

## ## Add sno to your project

All you need is **One** script tag<br/>
Download Locally [Here](https://snojs.github.io/build/crystal.js)

Run from the link with a script tag

```html
<script src="https://snojs.github.io/build/crystal.js"></script>
```

__To support older versions continue using__ 

```html
<script src="https://snojs.github.io/sno/sno.js"></script>
```

<ins>Liscensed with MIT</ins>
