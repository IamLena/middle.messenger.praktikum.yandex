// заглушка просто

export default `
<div class="{{className}}">
    {{#with inputData}}
        {{> input}}
    {{/with}}
    {{text}}
</div>
`;
