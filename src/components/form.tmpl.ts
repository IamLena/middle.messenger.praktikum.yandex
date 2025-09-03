export default `
<form class="{{className}}">
    <h1>{{formHeader}}</h1>
    {{#each inputDatas}}
        {{> input
            id=this.id
            label=this.label
            type=this.type
            name=this.name
            value=this.value
        }}
    {{/each}}
    {{> button type="submit" }}
</form>
`;
