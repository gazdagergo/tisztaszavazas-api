export default ({ roles }, context) => {
  const isAdmin = roles && roles.includes('admin')

  let projection = {
    sourceHtmlUpdated: 0,
    parsedFromSrcHtml: 0,
    createdAt: 0,
    vhuUrl: 0,
    polygonUrl: 0,
    valasztasAzonosito: 0,
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
      updatedAt: 0
    })

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