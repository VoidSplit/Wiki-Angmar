
let json_element = {

    banner: "",
    content: [

    ]

}

let banner_input = document.getElementById('banner_input')

let page_wrapper = document.getElementById('page_wrapper')

let text_area = document.getElementById('text_area')

banner_input.addEventListener('input', (e) => {
    let value = e.target.value
    json_element.banner = value
    draw_page(json_element)
})

text_area.addEventListener('input', (e) => {
    let value = e.target.value.split('\n');

    json_element.content = []
    value.forEach(el => {
        if(el.startsWith('[')) { if(el.includes(']')) { json_element.content.push(["img", el.split('[')[1].split(']')[0]]) } }
        else { if(el.startsWith('~sum~')) { json_element.content.push(["summary"]) }
        else {
            if (el.startsWith('# ')) {
                json_element.content.push(["#", el.substr(el.indexOf(" ") + 1)])
            } else 
            if (el.startsWith('## ')) {
                json_element.content.push(["##", el.substr(el.indexOf(" ") + 1)])
            } else 
            if (el.startsWith('### ')) {
                json_element.content.push(["###", el.substr(el.indexOf(" ") + 1)])
            } else 
            if (el.startsWith('#### ')) {
                json_element.content.push(["####", el.substr(el.indexOf(" ") + 1)])
            } else 
            if(el.startsWith('|')) {
                if(el.includes('|')) {
                    json_element.content.push(["box", el.split('|')[1]])
                }
            }
            else { json_element.content.push(["p", el]) }
        }}
        
        if(el) {}
    })
    draw_page(json_element)

})

const drawElement = (element, parent, summary) => {

    switch(element[0]) {
        case "summary":
            let summary_dom = document.createElement('div')
            summary_dom.classList.add('summary')

            summary.forEach(a => {
                let anchor = document.createElement('a')
                anchor.setAttribute('href', `#${a[1]}`)
                anchor.classList.add('summary_anchor')
                switch(a[0]) {
                    case "#":
                        anchor.classList.add('anchor_lvl_1')
                        break;
                    case "##":
                        anchor.classList.add('anchor_lvl_2')
                        break;
                    case "###":
                        anchor.classList.add('anchor_lvl_3')
                        break;
                    case "####":
                        anchor.classList.add('anchor_lvl_4')
                        break;
                }
                anchor.innerText = a[1]

                summary_dom.appendChild(anchor)
            })
            parent.appendChild(summary_dom)
            break;
        case "#":
            let h1 = document.createElement('h1')
            h1.innerText = element[1]

            let anchor_h1 = document.createElement("a")
            anchor_h1.setAttribute('id', element[1])
            anchor_h1.appendChild(h1)
            parent.appendChild(anchor_h1)
            break;
        case "##":
            let h2 = document.createElement('h2')
            h2.innerText = element[1]

            let anchor_h2 = document.createElement("a")
            anchor_h2.setAttribute('id', element[1])
            anchor_h2.appendChild(h2)
            parent.appendChild(anchor_h2)
            break;
        case "###":
            let h3 = document.createElement('h3')
            h3.innerText = element[1]

            let anchor_h3 = document.createElement("a")
            anchor_h3.setAttribute('id', element[1])
            anchor_h3.appendChild(h3)
            parent.appendChild(anchor_h3)
            break;
        case "####":
            let h4 = document.createElement('h4')
            h4.innerText = element[1]

            let anchor_h4 = document.createElement("a")
            anchor_h4.setAttribute('id', element[1])
            anchor_h4.appendChild(h4)
            parent.appendChild(anchor_h4)
            break;
        case "p":
            let p = document.createElement('p')
            p.innerText = element[1]
            parent.appendChild(p)
            break;
        case "img":
            let img = document.createElement('img')
            img.setAttribute('src', element[1])
            parent.appendChild(img)
            break;
        case "box":
            let box = document.createElement('div')
            box.innerText = element[1]
            box.classList.add('box')
            parent.appendChild(box)
            break;
        
    }
}

const draw_page = (json_element) => {
    page_wrapper.innerHTML = ``

    let banner = document.createElement('div')
    banner.classList.add('banner')
    if(json_element.banner !== "") {
        let banner_img = document.createElement('img')
        banner_img.setAttribute('src', json_element.banner)
    
        banner.appendChild(banner_img)
    }

    page_wrapper.appendChild(banner)

    let main = document.createElement('main')
    
    page_wrapper.appendChild(main)

    let summary_infos = json_element.content.filter(el => el[0] == "#" || el[0] == "##" || el[0] == "###" || el[0] == "####")

    json_element.content.forEach(element => {
        drawElement(element, main, summary_infos)
    })
}

draw_page(json_element)


const download = () => {
    let exportObj = json_element
    let exportName = `wiki_page_${new Date().valueOf()}`

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href",     dataStr)
    downloadAnchorNode.setAttribute("download", exportName + ".json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

const import_input = document.getElementById('import')

function onChange(event) {
    var reader = new FileReader()
    reader.onload = onReaderLoad
    reader.readAsText(event.target.files[0])
}

function onReaderLoad(event){
    json_element = JSON.parse(event.target.result)
    draw_page(json_element)
    banner_input.value = json_element.banner
    const json_text_area = [

    ]
    json_element.content.forEach(element => {
        switch(element[0]) {
            case "summary":
                json_text_area.push("~sum~")
                break;
            case "#":
                json_text_area.push(`# ${element[1]}`)
                break;
            case "##":
                json_text_area.push(`## ${element[1]}`)
                break;
            case "###":
                json_text_area.push(`### ${element[1]}`)
                break;
            case "####":
                json_text_area.push(`#### ${element[1]}`)
                break;
            case "p":
                json_text_area.push(`${element[1]}`)
                break;
            case "img":
                json_text_area.push(`[${element[1]}]`)
                break;
            case "box":
                json_text_area.push(`| ${element[1]}`)
                break;
        }
    })
    text_area.value = json_text_area.join('\n')
}

import_input.addEventListener('change', onChange)