<script setup>
  import FormHorizontal from '@/templates/create-form-block/form-horizontal'
  import FieldDropdown from '@/templates/form-fields-inputs/fieldDropdown.vue'
  import InputText from 'primevue/inputtext'
  import { computed } from 'vue'
  import { useAccountStore } from '@/stores/account'
  import FieldGroupRadio from '@/templates/form-fields-inputs/fieldGroupRadio'
  import { useField } from 'vee-validate'
  defineOptions({ name: 'form-fields-drawer-resource' })

  const props = defineProps({
    disabledFields: {
      type: Boolean,
      default: false
    }
  })

  const store = useAccountStore()
  const contentTypeShellScript = 'Shell Script'

  const editorOptions = computed(() => {
    return {
      minimap: { enabled: false },
      tabSize: 2,
      formatOnPaste: true,
      readOnly: props.disabledFields
    }
  })
  const { value: name, errorMessage: nameError } = useField('name')
  const { value: contentType } = useField('contentType')
  const { value: content, errorMessage: contentError } = useField('content')

  const theme = computed(() => {
    return store.currentTheme === 'light' ? 'vs' : 'vs-dark'
  })

  const isShellScript = computed(() => {
    return contentType.value === contentTypeShellScript
  })

  const typeRadioOptions = [
    {
      title: 'Shell Script',
      value: 'Shell Script'
    },
    {
      title: 'Text',
      value: 'Text'
    }
  ]

  const triggerRadioOptions = [
    {
      title: 'Install',
      inputValue: 'Install'
    },
    {
      title: 'Reload',
      inputValue: 'Reload'
    },
    {
      title: 'Uninstall',
      inputValue: 'Uninstall'
    }
  ]
</script>

<template>
  <form-horizontal
    :isDrawer="true"
    title="Resource"
    description="Configure the resources needed to install, uninstall, and reload your services."
  >
    <template #inputs>
      <div class="flex flex-col w-full sm:max-w-3xl gap-2">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col sm:max-w-lg w-full gap-2">
            <label
              for="name"
              class="text-color text-sm not-italic font-medium leading-5"
              >Path *</label
            >
            <InputText
              v-model="name"
              type="text"
              :class="{ 'p-invalid': nameError }"
              :disabled="props.disabledFields"
              placeholder="/tmp/myresource"
            />
            <small
              v-if="nameError"
              class="p-error text-xs font-normal leading-tight"
              >{{ nameError }}</small
            >
            <small class="text-xs text-color-secondary font-normal leading-5">
              The path where the resource will be saved on the edge node.
            </small>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:w-2/5 gap-2">
        <FieldDropdown
          label="Type"
          :options="typeRadioOptions"
          optionLabel="title"
          optionValue="value"
          inputClass="w-full"
          name="contentType"
          :value="contentType"
        />
      </div>
      <div v-show="isShellScript">
        <FieldGroupRadio
          label="Trigger Type"
          helpText="Define the trigger for when the script is executed."
          nameField="trigger"
          :isCard="false"
          :options="triggerRadioOptions"
        />
      </div>
      <div class="flex flex-col w-full sm:max-w-3xl gap-2">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col w-full gap-2">
            <label
              for="name"
              class="text-color text-sm not-italic font-medium leading-5"
              >Content *</label
            >
            <div class="flex flex-col h-full gap-2">
              <vue-monaco-editor
                v-model:value="content"
                language="shell"
                :theme="theme"
                class="min-h-[200px] overflow-clip surface-border border rounded-md"
                :class="{ 'border-red-500 border': contentError }"
                :options="editorOptions"
              />
              <small
                v-if="contentError"
                class="p-error text-xs font-normal leading-tight"
              >
                {{ contentError }}
              </small>
              <small class="text-xs text-color-secondary font-normal leading-5">
                The content of the resource. You can add variables to the resource content by
                referencing the tag
                <code>&#123;&#123; VARNAME &#125;&#125;</code>.<br />
                <strong>Shell Script</strong> resources must carry a shebang in the content header.
                In the absence of one, the POSIX-compliant shell on the device
                (<code>/bin/sh</code>) will be used.
              </small>
            </div>
          </div>
        </div>
      </div>
    </template>
  </form-horizontal>
</template>
