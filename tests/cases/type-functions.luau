type function UserDefinedTypeFunction(Foo: type, Bar: type, Qux: type): type
    return types.intersectionof(Foo, Bar, Qux)
end

export type function ExportUserDefinedTypeFunction(Foo: type, Bar: type, Qux: type): type
    return types.unionof(Foo, Bar, Qux)
end