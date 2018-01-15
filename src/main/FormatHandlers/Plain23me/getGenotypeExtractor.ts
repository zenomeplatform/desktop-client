
/**
 *  @method getGenotypeExtractor
 *
 *  Based on the header of the file construct extractor function.
 *
 *  @param  {string[]} header             array of header labels
 *  @return {(row: string[]) => any}      return "extractor" function
 */

 export function getExtractor (_header: string[]) {

   /** Normalize header labels. */
   let header = _header.map(
     label => /([a-z0-9]+)/.exec(label)[1])


   /** Get the indexes of interesting columns. */
   /** Genetic position */
   let i_rsid       = header.indexOf('rsid')
   let i_chromosome = header.indexOf('chromosome')
   let i_position   = header.indexOf('position')

   /** Genetic variant */
   let i_genotype   = header.indexOf('genotype')
   let i_allele1    = header.indexOf('allele1')
   let i_allele2    = header.indexOf('allele2')

   /** For now two possible layouts make sense: */
   if ( i_rsid     === 0 && i_chromosome === 1
     && i_position === 2 && i_genotype   === 3 )
        return row => row.slice(0, 4);


   if (i_rsid !== -1 && i_genotype !== -1) return (row) => [
       row[i_rsid], row[i_chromosome], row[i_position],
       row[i_genotype],
     ]

   if (i_rsid !== -1 && i_allele1  !== -1 && i_allele2 !== -1) return (row) => [
       row[i_rsid], row[i_chromosome], row[i_position],
       row[i_allele1] + row[i_allele2]
     ]


   throw new Error(
    `
     Missing required field in your file.
     Consider sending the following information.
     Header (no strip): "${_header}"
     Header=|${header.join('|')}|
    `
   )
 }
