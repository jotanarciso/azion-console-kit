<template>
  <ContentBlock>
    <template #heading>
      <PageHeadingBlock pageTitle="Edit Digital Certificate"></PageHeadingBlock>
    </template>
    <template #content>
      <EditFormBlock
        :editService="props.editDigitalCertificateService"
        :loadService="props.loadDigitalCertificateService"
        :schema="validationSchema"
        :updatedRedirect="props.updatedRedirect"
      >
        <template #form>
          <FormFieldsEditDigitalCertificates
            :clipboardWrite="clipboardWrite"
            :documentationService="documentationService"
          />
        </template>
        <template #action-bar="{ onSubmit, formValid, onCancel, loading, values }">
          <ActionBarBlockWithTeleport
            v-if="!values.managed"
            @onSubmit="onSubmit"
            @onCancel="onCancel"
            :loading="loading"
            :submitDisabled="!formValid"
          />
        </template>
      </EditFormBlock>
    </template>
  </ContentBlock>
</template>

<script setup>
  import EditFormBlock from '@/templates/edit-form-block'
  import ActionBarBlockWithTeleport from '@/templates/action-bar-block/action-bar-with-teleport.vue'
  import ContentBlock from '@/templates/content-block'
  import PageHeadingBlock from '@/templates/page-heading-block'
  import FormFieldsEditDigitalCertificates from './FormFields/FormFieldsEditDigitalCertificates.vue'
  import * as yup from 'yup'

  const props = defineProps({
    loadDigitalCertificateService: {
      type: Function,
      required: true
    },
    editDigitalCertificateService: {
      type: Function,
      required: true
    },
    updatedRedirect: {
      type: String,
      required: true
    },
    clipboardWrite: {
      type: Function,
      required: true
    },
    documentationService: {
      required: true,
      type: Function
    }
  })

  const validationSchema = yup.object({
    name: yup.string().required('Name is a required field.'),
    certificateType: yup.string(),
    csr: yup.string(),
    certificate: yup.string(),
    privateKey: yup.string(),
    managed: yup
      .boolean()
      .isFalse(
        `This is a Let's Encrypt™ certificate automatically created and managed by Azion and can't be edited.`
      )
  })
</script>
