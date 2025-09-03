// заглушка просто

export default `
<div class="{{className}}">
    <form>
        {{#with inputData}}
            {{> input}}
        {{/with}}
        {{text}}
    </form>
</div>
`;
