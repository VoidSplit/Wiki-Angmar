let params = new URLSearchParams(document.location.search)

let page_id = params.get("id")

const getRoute = async () => {
    const response = await fetch('./files.json')
    const data = await response.json()

    return data
}

const getPage = async (page) => {
    const response = await fetch(`./files/${page}.json`)
    const data = await response.json()

    return data
}

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
        case "columns":
            let columns = document.createElement('div')
            
            columns.classList.add(`columns`)
            columns.classList.add(`col_size_${element[1].size}`)

            element[1].content.forEach(col => {
                let column = document.createElement('div')
                
                column.classList.add(`size_${col.column_size}`)

                col.content.forEach(element => {
                    drawElement(element, column)
                })
                columns.appendChild(column)

            })
            parent.appendChild(columns)
            break;
    }
}

const display_page = (page_infos) => {

    let banner = document.createElement('div')
    banner.classList.add('banner')
    let banner_img = document.createElement('img')
    banner_img.setAttribute('src', page_infos.banner)

    banner.appendChild(banner_img)

    document.body.appendChild(banner)

    let main = document.createElement('main')
    
    document.body.appendChild(main)

    let summary_infos = page_infos.content.filter(el => el[0] == "#" || el[0] == "##" || el[0] == "###" || el[0] == "####")

    page_infos.content.forEach(element => {
        drawElement(element, main, summary_infos)
    })
}

const init = async () => {
    let data = await getRoute()
    let file = data.root.filter(page => page.id == page_id)[0].filename

    let page_infos = await getPage(file)

    display_page(page_infos)
}
init()


let download_button = document.getElementById('download')
download_button.addEventListener('click', async (e) => {
    let data = await getRoute()
    let file = data.root.filter(page => page.id == page_id)[0].filename

    let page_infos = await getPage(file)
    
    let exportObj = page_infos
    let exportName = `wiki_page_${file}`

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href",     dataStr)
    downloadAnchorNode.setAttribute("download", exportName + ".json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()

})
