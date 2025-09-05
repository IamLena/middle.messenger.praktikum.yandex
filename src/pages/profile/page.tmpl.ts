export default `
<div class="{{className}}">
    <div class="{{containerClassName}}">
        {{#with formData}}
            {{> form}}
        {{/with}}
    </div>
</div>
`;
