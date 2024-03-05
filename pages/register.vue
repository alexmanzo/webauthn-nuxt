<template>
  <div class="card flex justify-content-center">
    <InputText type="email" v-model="email" />
    <Button label="Submit" @click="createUser" />
  </div>
</template>

<script setup lang="ts">
const email: Ref<string | null> = ref(null);

async function createUser() {
  const { data, pending, error, refresh } = await useFetch('/api/user', {
    method: 'POST',
    body: JSON.stringify({ email: email.value }),
  });
  console.log({data, pending, error, refresh});
}
</script>
