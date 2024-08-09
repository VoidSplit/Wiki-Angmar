const getFiles = async () => {
    const response = await fetch('./files.json')
    const data = await response.json()

    return data
}
const getCurrentURL = () => {
    return window.location.href
}

let item_list = document.getElementById('item_list')
let suggestions = document.getElementById('suggestions')
let more_links = document.getElementById('more_links')
let suggestions_label = document.getElementById('suggestions_label')

const search_keyword = (value, array) => {
    const lowerCaseValue = value.toLowerCase()
    const result = []

    for (let i = 0; i < array.root.length; i++) {
        if (array.root[i].keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseValue))) {
            result.push(array.root[i].filename)
        }
    }

    return result
}

const create_suggestions_dom = (value, infos, limit=5) => {
    let data = infos.root

    value.forEach((val, index) => {
        if(index <= limit-1) {

            let item_data = data.filter(el => el.filename == val)[0]

            let item = document.createElement('div')
            item.classList.add('item')
            item.setAttribute('tabindex', "0")
            item.textContent = item_data.display
    
            item.addEventListener('click', (e) => {
                e.preventDefault
                let url = new URL(window.location);
                url.pathname = "/page.html"
                url.searchParams.set('id', item_data.id);
                window.location = url
            })

            item_list.appendChild(item)
        } else {
            let more_value = value.length - limit

            if(more_value === 1 ) {
                more_links.getElementsByTagName('span')[0].innerText = `+${more_value} more link`
            } else {
                more_links.getElementsByTagName('span')[0].innerText = `+${more_value} more link`
            }
            more_links.classList.add('visible')
        }
    })
}


let search_input = document.getElementById('search')

search_input.addEventListener('input', async (e) => {
    item_list.innerHTML = ``
    let input_value = e.target.value
    if(input_value.length > 0) {
        let suggestions = search_keyword(input_value, await getFiles())
        if(suggestions.length > 0) {
            suggestions_label.classList.add("visible")
        } else {
            suggestions_label.classList.remove("visible")
        }
        create_suggestions_dom(suggestions, await getFiles())
    } else {
        suggestions_label.classList.remove("visible")
        more_links.classList.remove('visible')
    }
})
