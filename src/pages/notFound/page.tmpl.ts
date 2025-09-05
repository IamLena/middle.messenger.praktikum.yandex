export default `
<div class="{{containerClassName}}">
    <div class="{{className}}">
        {{text}}
    </div>
    {{#with linkData}}
        {{> link}}
    {{/with}}
</div>
`;
