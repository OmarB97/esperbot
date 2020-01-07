<template>
  <div class="home flex justify-center flex-col items-center">
    <img
      class="w-full h-64 object-cover"
      src="https://source.unsplash.com/random"
      alt=""
    />
    <div
      class="flex flex-col items-center bg-gray-400 w-1/3 p-10 rounded-lg shadow-xl -m-24"
    >
      <img
        class="h-64 w-64 rounded-full object-cover"
        src="https://source.unsplash.com/random"
        alt=""
      />
      <h5 class="text-2xl font-semibold">Some Image Information</h5>
      <p class="text-left mt-4">
        <span class="text-purple-900 font-extrabold">Lorem ipsum</span> dolor
        sit, amet consectetur adipisicing elit. Vel inventore aut, labore, porro
        est quidem deleniti officiis rem perspiciatis corrupti tempore dolorum
        ex mollitia assumenda, error quod quam voluptatibus fugiat.
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {}
};
</script>
