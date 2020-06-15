export const getProjection = ({ roles }, context) => {
  const isAdmin = roles && roles.includes('admin')

  let projection = {
    sourceHtmlUpdated: 0,
    parsedFromSrcHtml: 0,
    createdAt: 0,
    vhuUrl: 0,
    polygonUrl: 0,
		helyadatok: 0
  }

  switch (context) {
    case 'withQuery':
    case 'noQuery': return ({
      kozteruletek: 0,
      sourceHtmlUpdated: 0,
      frissitveValasztasHun: 0,
      parsedFromSrcHtml: 0,
      vhuUrl: 0,
      polygonUrl: 0,
      createdAt: 0,
      updatedAt: 0,
      valasztasAzonosito: 0,
      helyadatok: 0
    })

    case 'filterStreet': return ({
      szavazokorSzama: 1,
      'kozigEgyseg.kozigEgysegNeve': 1,
      'kozigEgyseg.megyeNeve': 1,
      'kozigEgyseg.megyeKod': 1,
      'kozigEgyseg.telepulesKod': 1,
    })

    case 'withRegex': return ({
      ...projection,
      frissitveValasztasHun: 0,
      szavazokorCime: 0,
      valasztokSzama: 0,
      valasztokerulet: 0,
      akadalymentes: 0,
      updatedAt: 0,
      helyadatok: 0
    })

    case 'byId':
    default:
      if (isAdmin) {
        delete projection['kozigEgyseg.megyeKod']
        delete projection['kozigEgyseg.telepulesKod']
        delete projection.polygonUrl
        delete projection.vhuUrl
      }
      return projection
  }
}

export const mapQueryResult = (result, query, db, szkSzamIfLengthOne) => result.map(({
  _id,
  kozigEgyseg,
  szavazokorSzama,
  kozteruletek,
  szavazokorCime,
  akadalymentes,
  valasztokerulet,
  valasztokSzama,
  __v,
  ...rest
}) => {
  const entry = {
    _id,
    szavazokorSzama,
    kozigEgyseg: {
      ...kozigEgyseg,
      link: `/kozigegysegek/${kozigEgyseg}`
    },
    szavazokorCime,
    akadalymentes,
    valasztokerulet,
    kozteruletek,
    valasztokSzama,
    __v
  }

  Object.keys(query).forEach(key => {
    key = key.split('.')[0]
    if (rest[key]) entry[key] = rest[key]
  })           

  return entry
})

export const mapIdResult = ({
  _id,
  szavazokorSzama,
  valasztokerulet,
  kozigEgyseg,
  szavazokorCime,
  akadalymentes,
  valasztokSzama,
  kozteruletek,
  frissitveValasztasHun,
  updatedAt,
  helyadatok,
  korzethatar,
  szavazohelyisegHelye,
  __v
}, db, kozigEgysegSzavazokoreinekSzama) => ({
  _id,
  szavazokorSzama,
  kozigEgyseg: {
    ...kozigEgyseg,
    link: `/kozigegysegek/${kozigEgyseg}`
  },
  szavazokorCime,
  akadalymentes,
  valasztokSzama,
  valasztokerulet,
  kozteruletek,
  helyadatok,
  korzethatar,
  szavazohelyisegHelye,
  frissitveValasztasHun,
  valasztasHuOldal: `/vhupage/${db}/${_id}`,
  valasztasKodja: db,
  updatedAt,
  __v
})