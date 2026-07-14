
interface props {
    value : string ,
    onChange : (e : any) => void 
}
export function Textarea({value , onChange} :props){
    return (
        <>
        {JSON.stringify(value)}
        </>
    )
}