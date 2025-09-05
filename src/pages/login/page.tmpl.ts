export default `
<div class="{{className}}">
    <div class="{{containerClassName}}">
        {{#with formData}}
            {{> form}}
        {{/with}}
        <div>
            <span>{{text}}</span> {{#with lintData}} {{> link}} {{/with}}
        </div>
    </div>
</div>
`;
