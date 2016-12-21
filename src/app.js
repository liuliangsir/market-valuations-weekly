import echarts from 'echarts'
import {Promise} from 'es6-promise'
import $ from 'jquery'
import 'table'
import 'canvas2image'
import 'html2canvas'
let chartInstance = []
let isKeyUsedInObjForIn = key => Object.is(key, 'util')
let api = '/weeklyreview/detail/'
// let api = 'http://121.43.168.179:18005/weeklyreview/detail/'
let info = {
  table: {
    dom: [
      $('#firstTable'),
      $('#secondTable')
    ],
    data: [],
    cb() {
      this.dom.forEach((item, index) => {
        item.bootstrapTable({
          data: this.data[index]
        })
        // info.util.createImage(window.html2canvas, window.Canvas2Image, item, '.table-responsive', index)
      })
    }
  },
  echart: {
    dom: [
      $('#firstContainer')[0],
      $('#secondContainer')[0],
      $('#thirdContainer')[0],
      $('#forthContainer')[0],
      $('#fifthContainer')[0]
    ],
    data: [
      {
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect) {
            return [point[0], '10%']
          },
          formatter(params) {
            if (Array.isArray(params)) {
              let [{color, value, name, seriesName}] = params
              return `当前时间为${name}<br/><i style="width:10px;height:10px;border-radius:100%;background-color:${color};display:inline-block;"></i>${seriesName}：${info.util.createDemicalDataPattern(value)}`
            } else {
              let { color, name, seriesName, value} = params
              // 更新颜色
              return `${seriesName}<br/><i style="width:10px;height:10px;border-radius:100%;background-color:${color.replace(/0/, 1)};display:inline-block;"></i>${name}：${info.util.createDemicalDataPattern(value)}`
            }
          }
        },
        grid: {
          show: true,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false,
          splitLine: {
            show: true
          },
          axisLine: {
            onZero: false
          },
          axisLabel: {
            formatter(value, index) {
              let arr = value.split('/')
              arr.splice(arr.length - 1, 1)
              return arr.join('/')
            },
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          scale: true,
          splitArea: {
            show: false
          },
          position: 'right',
          minInterval: 5,
          interval: 5,
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: false,
            type: 'slider',
            y: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '标普500静态PE',
            type: 'line',
            smooth: true,
            sampling: 'average',
            itemStyle: {
              normal: {
                color: 'rgb(64, 169, 194)'
              }
            },
            data: [],
            markPoint: {
              symbol: 'pin',
              data: [
                {
                  type: 'max',
                  name: '最大值',
                  label: {
                    normal: {
                      position: 'bottom'
                    }
                  },
                  symbolOffset: [0, '-100%']
                },
                {
                  type: 'min',
                  name: '最小值',
                  symbolRotate: 180,
                  label: {
                    normal: {
                      position: 'top'
                    }
                  },
                  symbolOffset: [0, '100%']
                }
              ],
              label: {
                normal: {
                  formatter({data: {value}}) {
                    return info.util.createDemicalDataPattern(value)
                  },
                  show: true,
                  textStyle: {
                    color: 'rgb(64, 169, 194)',
                    fontSize: 16
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(64, 169, 194, 0)'
                }
              },
              symbolSize: [70, 50]
            },
            markLine: {
              symbol: ['circle', 'circle'],
              data: [
                {
                  type: 'average',
                  name: '平均值',
                  label: {
                    normal: {
                      formatter: ''
                    }
                  }
                },
                [
                  {
                    x: '10%',
                    yAxis: 'average'
                  }, {
                    label: {
                      normal: {
                        position: 'start',
                        formatter(params) {
                          if (!Array.isArray(params)) {
                            let { name, value} = params
                            return `${name}\n${info.util.createDemicalDataPattern(value)}`
                          }
                        }
                      }
                    },
                    type: 'average',
                    name: '平均值'
                  }
                ]
              ]
            },
            markArea: {

            }
          }
        ]
      },
      {
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect) {
            return [point[0], '10%']
          },
          formatter(params) {
            if (Array.isArray(params)) {
              let [{color, value, name, seriesName}] = params
              return `当前时间为${name}<br/><i style="width:10px;height:10px;border-radius:100%;background-color:${color};display:inline-block;"></i>${seriesName}：${info.util.createDemicalDataPattern(value)}`
            } else {
              let { color, name, seriesName, value} = params
              // 更新颜色
              return `${seriesName}<br/><i style="width:10px;height:10px;border-radius:100%;background-color:${color.replace(/0/, 1)};display:inline-block;"></i>${name}：${info.util.createDemicalDataPattern(value)}`
            }
          }
        },
        grid: {
          show: true,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false,
          splitLine: {
            show: true
          },
          axisLine: {
            onZero: false
          },
          axisLabel: {
            formatter(value, index) {
              let arr = value.split('/')
              arr.splice(arr.length - 1, 1)
              return arr.join('/')
            },
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          scale: true,
          splitArea: {
            show: false
          },
          position: 'right',
          minInterval: 0.9,
          interval: 0.9,
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: false,
            type: 'slider',
            y: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '标普500PB',
            type: 'line',
            smooth: true,
            sampling: 'average',
            itemStyle: {
              normal: {
                color: 'rgb(64, 169, 194)'
              }
            },
            data: [],
            markPoint: {
              symbol: 'pin',
              data: [
                {
                  type: 'max',
                  name: '最大值',
                  label: {
                    normal: {
                      position: 'bottom'
                    }
                  },
                  symbolOffset: [0, '-100%']
                },
                {
                  type: 'min',
                  name: '最小值',
                  symbolRotate: 180,
                  label: {
                    normal: {
                      position: 'top'
                    }
                  },
                  symbolOffset: [0, '100%']
                }
              ],
              label: {
                normal: {
                  formatter({data: {value}}) {
                    return info.util.createDemicalDataPattern(value)
                  },
                  show: true,
                  textStyle: {
                    color: 'rgb(64, 169, 194)',
                    fontSize: 16
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(64, 169, 194, 0)'
                }
              },
              symbolSize: [70, 50]
            },
            markLine: {
              symbol: ['circle', 'circle'],
              data: [
                {
                  type: 'average',
                  name: '平均值',
                  label: {
                    normal: {
                      formatter: ''
                    }
                  }
                },
                [
                  {
                    x: '10%',
                    yAxis: 'average'
                  }, {
                    label: {
                      normal: {
                        position: 'start',
                        formatter(params) {
                          if (!Array.isArray(params)) {
                            let { name, value} = params
                            return `${name}\n${info.util.createDemicalDataPattern(value)}`
                          }
                        }
                      }
                    },
                    type: 'average',
                    name: '平均值'
                  }
                ]
              ]
            },
            markArea: {

            }
          }
        ]
      },
      {
        title: {
          text: '',
          subtext: ''
        },
        color: ['#40a9c2'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '70%',
            barCategoryGap: '0%',
            data: [],
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            }
          }
        ]
      },
      {
        title: {
          text: '',
          subtext: ''
        },
        color: ['#40a9c2'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
          // interval: 1
        },
        yAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '70%',
            barCategoryGap: '0%',
            data: [],
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            }
          }
        ]
      },
      {
        xAxis: {
          name: 'PE',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
            color: '#9dcee6'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          // interval: 5,
          nameRotate: 0
        },
        yAxis: {
          name: 'PB',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
            color: '#9dcee6'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true
        },
        series: [{
          name: '板块',
          data: [],
          type: 'scatter',
          symbolSize: function (data) {
            return Math.sqrt(data[2]) * 2
          },
          label: {
            emphasis: {
              show: true,
              formatter: function (param) {
                return param.data[3]
              },
              position: 'bottom'
            },
            normal: {
              show: true,
              formatter: function (param) {
                return param.data[3]
              },
              position: 'top',
              textStyle: {
                color: '#000'
              }
            }
          },
          itemStyle: {
            normal: {
              color: '#9dcee6'
            }
          }
        }, {
          name: '标普500',
          data: [
          ],
          type: 'scatter',
          symbolSize: function (data) {
            return Math.sqrt(data[2]) * 3
          },
          label: {
            emphasis: {
              show: true,
              formatter: function (param) {
                return param.data[3]
              },
              position: 'bottom'
            },
            normal: {
              show: true,
              formatter: function (param) {
                return param.data[3]
              },
              position: 'top',
              textStyle: {
                color: '#000'
              }
            }
          },
          itemStyle: {
            normal: {
              color: '#fab696'
            }
          }
        }]
      }
    ],
    cb() {
      this.dom.forEach((item, index) => {
        let myChart = echarts.init(item)
        myChart.setOption(this.data[index], true)
        chartInstance.push(myChart)
        // info.util.createEchartImage(myChart, '.echarts-container-image', index)
        // $(item).remove()
        myChart = null
      })
    }
  },
  progressBar: {
    dom: [
      $('#firstProgressBarContent'),
      $('#secondProgressBarContent')
    ],
    data: [
      [],
      []
    ],
    cb() {
      this.dom.forEach((item, index) => {
        let html = ''
        this.data[index].forEach((item) => {
          let {name, percentage} = item
          html += `<div class="progress-bar-content-item"><span class="pull-left">${name}</span><div class="pull-left"><hr/><span class="progress-bar-button" style="left:${percentage}"></span></div></div>`
        })
        item.html(html)
        // info.util.createImage(window.html2canvas, window.Canvas2Image, item.parents('.progress-bar-wrapper'), '.progress-bar-wrapper', index)
      })
    }
  },
  util: {
    createImage(html2canvas, canvas2Image, elem, selector, index) {
      html2canvas(elem, {
        onrendered(canvas) {
          $(`${selector}-image-${index}`).attr('src', canvas.toDataURL())
        },
        onpreloaded() {

        },
        onparsed() {

        }
      })
    },
    createEchartImage(echartInstance, selector, index) {
      $(`${selector}-${index}`).attr('src', echartInstance.getDataURL())
    },
    createFirstTableAndTextData(data) {
      let arr = [[], [], [], [0, 0]]
      if (!Array.isArray(data)) return arr
      let key = null
      data.forEach((item, index) => {
        key = Object.keys(item)[0]
        arr[0].push(Object.assign({'stock_name': (this.replaceStockName(key, false)), 'index': index}, ((obj) => {
          for (let k in obj) {
            if (!obj.hasOwnProperty(k)) continue
            obj[k] = this.createDemicalDataPattern(Number(obj[k]))
            if (Object.is(k, 'f_percent_weekly_performance')) {
              // 统计上周全球股票涨跌情况
              if (obj[k] < 0) {
                arr[3][0]++
              } else {
                arr[3][1]++
              }
              if (this.isGetGlobalStockFieldData(key)) {
                arr[1].push({
                  name: key,
                  value: obj[k]
                })
              }else if (this.isGetUsStockFieldData(key)) {
                arr[2].push({
                  name: this.replaceStockName(key),
                  value: obj[k]
                })
              }
            }
          }
          return obj
        })(item[key])))
      })
      // 实现标普500/道琼斯/纳斯达克股票置于表格最后
      arr[0].sort((v1, v2) => v2.index - v1.index)
      return arr
    },
    createDemicalDataPattern(demical) {
      return Number(demical).toFixed(2)
    },
    createEchartData(data) {
      if (!Array.isArray(data)) return []
      for (let i = 0, len = data.length; i < len; i++) {
        data[i] = this.createDemicalDataPattern(data[i])
      }
      return data
    },
    createYearAndMonthData(data) {
      if (!Array.isArray(data)) return []
      let {min, max, arr} = {min: data[0], max: data[data.length - 1], arr: []}
      let [minYear, minMonth] = min.split('/').map(item => Number(item))
      let [maxYear, maxMonth] = max.split('/').map(item => Number(item))
      for (let curentYear = minYear, curentMonth = minMonth; curentYear <= maxYear;) {
        arr.push(`${curentYear}/${this.leftpad(curentMonth, 2, 0)}`)
        curentMonth++
        if (curentMonth > 12) {
          curentYear++
          curentMonth = 1
        }
        if (Object.is(curentYear, maxYear) && Object.is(curentMonth, maxMonth + 1)) break
      }
      return arr
    },
    createOtherData(data, {other, another}) {
      let obj = {
        pb: [],
        pe: [],
        firstEchartData: {
          y: other.sp500_last10years_pe_dates,
          x: this.createEchartData(other.sp500_last10years_pe_values)
          // y: this.createYearAndMonthData(other.sp500_last10years_pe_dates)
        },
        secondEchartData: {
          y: other.sp500_last10years_pb_dates,
          x: this.createEchartData(other.sp500_last10years_pb_values)
          // y: this.createYearAndMonthData(other.sp500_last10years_pb_dates)
        },
        thirdEchartData: {
          x: [],
          y: []
        },
        forthEchartData: {
          x: [],
          y: []
        },
        fifthEchartData: {
          x: [],
          y: []
        },
        secondTableData: []
      }
      for (let key in data) {
        if (!data.hasOwnProperty(key)) continue
        obj.pb.push({name: key, percentage: this.createProgressData(data[key]['ttm_pb'], data[key]['min_pb'], data[key]['max_pb'])})
        obj.pe.push({name: key, percentage: this.createProgressData(data[key]['ttm_pe'], data[key]['min_pe'], data[key]['max_pe'])})
        if (this.isDataLegal(data[key]['ttm_pe'])) {
          obj.thirdEchartData.y.push(key)
          obj.thirdEchartData.x.push(this.createDemicalDataPattern(data[key]['ttm_pe']))
        }
        if (this.isDataLegal(data[key]['ttm_pb'])) {
          obj.forthEchartData.y.push(key)
          obj.forthEchartData.x.push(this.createDemicalDataPattern(data[key]['ttm_pb']))
        }
        obj.fifthEchartData.x.push([data[key]['ttm_pe'], data[key]['ttm_pb'], 100, key, '板块'])// 板块所需的数据
        obj.secondTableData.push({
          'stock_name': key,
          'ttm_pe': this.createDemicalDataPattern(data[key]['ttm_pe']),
          'ttm_pb': this.createDemicalDataPattern(data[key]['ttm_pb']),
          'f_percent_weekly_performance': this.createDemicalDataPattern(data[key]['f_percent_weekly_performance']),
          'f_percent_monthly_performance': this.createDemicalDataPattern(data[key]['f_percent_monthly_performance']),
          'f_percent_6month_performance': this.createDemicalDataPattern(data[key]['f_percent_6month_performance'])
        })
      }

      obj.fifthEchartData.y.push([another.ttm_pe, another.ttm_pb, 100, '标普500', '标普500'])// 标普500所需的数据
      return obj
    },
    createProgressData(current, min, max) {
      return `${this.createDemicalDataPattern(((current - min) / (max - min) * 100))}%`
    },
    parseInt(num) {
      return Number(Number(num).toFixed(0))
    },
    getUpOrDownInfo({name = '', value = 0}, isWeekUpOrDown = false) {
      let upOrDownInfos = [
        {up: '上涨', down: '下跌'},
        {up: '周涨幅', down: '周跌幅'}
      ]
      let upOrDownInfo = isWeekUpOrDown ? upOrDownInfos[1] : upOrDownInfos[0]
      if (Number(value) < 0) return `${name}${upOrDownInfo.down}${value.slice(1)}%`
      else return `${name}${upOrDownInfo.up}${value}%`
    },
    replaceStockName(name, isReplace = true) {
      switch (name) {
        case '道琼斯工业': return isReplace ? '道琼斯指数' : `${name}`
        case 'NASDAQ': return isReplace ? '纳指100' : `纳指100`
        case '标普500': return isReplace ? '标普500指数' : `${name}`
        default: return name
      }
    },
    combineArray(arr1, arr2) {
      let key = 'other'
      arr1.forEach((item, index) => {
        item[key] = arr2[index]
      })
      return arr1
    },
    isDataLegal(num) {
      if (Number(num) >= 0) return true
      else return false
    },
    isGetGlobalStockFieldData(key) {
      if (Object.is(key, '英国ETF') || Object.is(key, '法国ETF') || Object.is(key, '德国ETF') || Object.is(key, '上证综合指数')) return true
      else return false
    },
    isGetUsStockFieldData(key) {
      if (Object.is(key, '标普500') || Object.is(key, '道琼斯工业') || Object.is(key, 'NASDAQ')) return true
      else return false
    },
    leftpad(str, len, ch) {
      str = String(str)
      let i = -1
      if (!ch && ch !== 0) ch = ' '
      len = len - str.length
      while (++i < len) {
        str = ch + str
      }
      return str
    },
    getArrayMinAndMax(array) {
      if (!Array.isArray(array)) return [0, 0]
      let length = array.length
      let arr = array.slice().sort((v1, v2) => v1 - v2)
      return [this.parseInt(arr[0]), this.parseInt(arr[length - 1])]
    }
  },
  text: {
    dom: [
      [$('#last-global-stock'), $('#english'), $('#france'), $('#germany'), $('#china')],
      [$('#sp'), $('#nasdaq'), $('#jones')],
      [$('#weekly-title')]
    ],
    data: [],
    cb() {
      let text = null
      let data = null
      this.dom[2].forEach((item, index) => {
        text = item.text().trim()
        data = this.data[2]
        item.text(`${data}${text}`)
      })
      this.dom[0].forEach((item, index) => {
        text = item.text().trim()
        data = this.data[0]
        if (index) {
          item.text(`${text}${info.util.getUpOrDownInfo(data[index])}`)
        }else {
          let reg = /\{\$\d\}/g
          let i = 0
          item.text(`${text}`.replace(reg, (v, k, input) => `${data[index][i++]}`))
        }

      })
      this.dom[1].forEach((item, index) => {
        text = item.text()
        data = this.data[1]
        item.text(`${text}${data[index]['name']}报收${data[index]['other']}点，${info.util.getUpOrDownInfo({value: data[index]['value']}, true)}`)
      })
    }
  }
}

$(document).ready(() => {
  let callback = () => {
    for (let key in info) {
      if (info.hasOwnProperty(key) && !isKeyUsedInObjForIn(key)) {
        info[key].cb()
      }
    }
  }
  let sendAjaxRequest = (date) => $.ajax({
    type: 'GET',
    url: api,
    data: {date},
    dataType: 'json'
  })
  let getTodayDate = () => {
    let time = String($('html').data('time')).trim()
    if (!Object.is(time, '')) return time
    // if (Object.is(time, '')) return time
    let date = new Date()
    return `${date.getFullYear()}${info.util.leftpad(date.getMonth() + 1)}${info.util.leftpad(date.getDate())}`
  }
  let initial = () => {
    sendAjaxRequest(getTodayDate()).then(response => {
      if (response.status) return Promise.reject()
      let {data} = response
      let {pb, pe, firstEchartData, secondEchartData, thirdEchartData, forthEchartData, fifthEchartData, secondTableData} = info.util.createOtherData(data.sectors_last10years_max_min_pb_pe,
        {
          other: data.sp500_last10years_pb_pe,
          another: data.sp500_ttm_pb_pe
        }
      )
      let tableAndTextData = info.util.createFirstTableAndTextData(data.index_infos)
      info.table.data[0] = tableAndTextData[0]
      
      info.table.data[1] = secondTableData
      Array.of(firstEchartData, secondEchartData, thirdEchartData, forthEchartData, fifthEchartData).forEach((item, index) => {
        switch (index) {
          case 4: {
            Array.of(item.x, item.y).forEach((v, k) => {
              info.echart.data[index].series[k].data = v
            })
            break
          }
          case 0:
          case 1: {
            // 获取y轴的最大值以及最小值
            let minAndMaxVal = info.util.getArrayMinAndMax(item.x)
            let { minValueStep, maxValueStep } = { maxValueStep: 0.5, minValueStep: 0.5 }
            info.echart.data[index].yAxis.min = minAndMaxVal[0] - info.echart.data[index].yAxis.interval * minValueStep
            info.echart.data[index].yAxis.max = minAndMaxVal[1] + info.echart.data[index].yAxis.interval * maxValueStep
            info.echart.data[index].series[0].data = item.x
            info.echart.data[index].xAxis.data = item.y
            break
          }
          default: {
            info.echart.data[index].yAxis.data = item.y
            info.echart.data[index].series[0].data = item.x
          }
        }
      })
      info.progressBar.data[0] = pe
      info.progressBar.data[1] = pb
      info.text.data = [
        [
          tableAndTextData[3],
          ...tableAndTextData[1]
        ],
        [
          ...info.util.combineArray(tableAndTextData[2], [
            info.util.createDemicalDataPattern(data['3_index_price']['$SPX']),
            info.util.createDemicalDataPattern(data['3_index_price']['$INDU']),
            info.util.createDemicalDataPattern(data['3_index_price']['$COMPQ'])
          ])
        ],
        [data['date']]
      ]
      return Promise.resolve()
    }).then(() => {
      callback()
    }, () => {
      console.log('后端服务出现故障', '请前后端工程师注意联调')
    })
  }
  initial()
})
$(window).on('resize', event => {
  chartInstance.forEach(item => {
    item.resize()
  })
})
