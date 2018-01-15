<template>
  <v-container grid-list-md class="mb-0" style="display: fixed;">

  <v-layout row>
    <v-flex xs8>

        <GeneticData class="centering" @wheel.native.passive='wheel'
          :fileId="id"
          :offset.sync="offset"
          :search="search"
        />


     <v-text-field
       label="Search by RSId: "
       v-model="search"
     />
     <!--v-card @click="modifyOffset">
         <v-btn delta="-1000">-1000 </v-btn>
         <v-btn delta="-100"> -100  </v-btn>
         <v-btn delta="-10">  -10   </v-btn>
       <input disable v-model="offset"/>
         <v-btn delta=" 10">  +10   </v-btn>
         <v-btn delta=" 100"> +100  </v-btn>
         <v-btn delta=" 1000">+1000 </v-btn>
     </v-card-->
   </v-flex>

</v-layout>
</v-container>
</template>

<script>

const GeneticData = {
  template: `
  <div class="geneticData">
  <v-data-table :items="data" hide-actions class="elevation-1">

      <template slot="headers" slot-scope="props">
        <th style="width: 120px; text-align: left; padding-left: 5px;">RSId</th>
        <th style="width: 50px; text-align: left; padding-left: 5px;">Chr.</th>
        <th style="width: 100px; text-align: left; padding-left: 5px;">Pos.</th>
        <th style="width: 100px; text-align: left; padding-left: 5px;">Gen.</th>
      </template>

      <template slot="items" slot-scope="props">
        <td style="width: 120px; ">{{ props.item[0] }}</td>
        <td style="width: 50px;">{{ props.item[1] }}</td>
        <td style="width: 100px;">{{ props.item[2] }}</td>
        <td style="width: 100px;">{{ props.item[3] }}</td>
      </template>
    </v-data-table>
  </div>`,
  props: [ 'fileId', 'offset', 'search' ],
  mounted () {
    this.updateFull()
  },
  methods: {
    // TODO FIX IT
    updateFull () {
      this.$addTask("load-to-ram", this.fileId)
      setTimeout(() => this.refresh (), 200)
    },
    refresh () {
      this.$addTask("get-from-ram", this.fileId, this.offset, this.search)
      .then( R => {
        this.data = R.data
        if (this.offset > R.offset)
          this.$emit('update:offset', R.offset-1)
      })
    }
  },
  watch: {
    fileId () { this.updateFull() },
    search: 'refresh',
    offset: 'refresh'
  },
  data () {
    return {
      data: []
    }
  }
}


const GeneticDataView = {
  props: ['id'],
  components: {GeneticData},
  watch: {
    offset () { if (this.offset < 0) this.offset = 0 }
  },
  methods: {
    wheel ({offsetX, deltaY }) {
      this.offset += Math.floor(deltaY /7)
    },
    modifyOffset ({ target: { attributes } }) {
      if (attributes.delta) this.offset += parseInt(attributes.delta.value)
    }
  },
  data() {
    return {
      offset: 0,
      search: ''
    }
  }
}

export default GeneticDataView

</script>

<style scoped lang="scss">
.centering>>> * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}


.centering  >>> table {
    table-layout: fixed;
  }
.centering  >>> thead {
    height: 24px !important;
    overflow: hidden;
  }
.centering >>> td,.centering >>> tr {
    padding: 1px 5px ! important;
    margin: 1px! important;
    height: 24px ! important;
  }

.centering  >>> tr.datatable__progress {
    height: 0px ! important;
  }

.centering {
  overflow: hidden;
  height: calc(95vh - 170px) ;
  width: 350px;
}



.centering >>> .geneticData {
  white-space: nowrap;
  padding: 10px;
}


.search-panel {
  input {
    float: right;
    width: 70%;
  }
  width: 100%;
}

.pagitation {
  border: 1px solid black;
  padding: 5px;
  width: 100%;
  position: absolute;
  display: flex;
  bottom: 0px;
  input {
    display: list-item;
  }
  button {
    width: 45px;
    height: 20px;
  }

  button.twenty {
    width: 35px;
  }
}
</style>
