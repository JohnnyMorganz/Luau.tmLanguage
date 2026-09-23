type Test = {
    read readonly_property: string,
    write writeonly_property: string,
    property: string,
    read [any]: any,
    write [string]: number,
    [boolean]: string,
}
