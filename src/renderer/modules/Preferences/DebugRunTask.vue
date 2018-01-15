<template>
    <v-card>
      <v-text-field v-model="task" label="Enter command" multi-line/>

      <v-btn block @click="runtask">RUN</v-btn>
      <div class="output">
        {{ taskres }}
      </div>

    </v-card>
</template>

<script>

  const DebugRunTask = {
    data () {
      return {
        task: `
        { "task": ["request-rsid", "<fileid>"],
          "url":"http://analyze.rosalind.ru/zenome_mvp/analyze_json.php",
         "rsids":  [
      "rs7501331", "rs12934922", "rs1801133", "rs4654748", "rs1801131", "rs602662",
      "rs33972313","rs2282679",  "rs12272004","rs731236",  "rs1229984", "rs671",
      "rs1800497", "rs2494732",  "rs806380",  "rs2472297", "rs4410790", "rs5751876",
      "rs762551",  "rs1007371",  "rs1446109", "rs723524"
      ] }
        `,
        taskres: ''
      }
    },
    methods: {
      runtask () {
        this.$store.dispatch('addTask', JSON.parse(this.task))
          .then(result => JSON.stringify(result, null, 2))
          .then(result => { this.taskres = result })
      }
    }
  }
  export default DebugRunTask
</script>


<style>
.output {
  padding-top: 0cm;
  white-space: pre-wrap;
  width: 90%;
  word-break: break-all;
}
</style>
