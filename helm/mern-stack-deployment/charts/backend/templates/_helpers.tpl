{{- define "helpers.list-env-variables"}}
{{- range $key, $val := .Values.env.secret }}
- name: {{ $key }}
  valueFrom:
    secretKeyRef:
      name: backend-secret
      key: {{ $key }}
{{- end}} 
{{- end}}


