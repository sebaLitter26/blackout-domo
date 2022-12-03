import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartType, ChartOptions, ChartEvent, registerables, ActiveElement } from 'chart.js';
Chart.register(...registerables);
import { Observable, of, Subscription } from 'rxjs';
import { ChartInfo, Info } from '../chart';
import 'chartjs-adapter-date-fns';
//import { type } from 'os';

type Inf = { x: Date, y: number }

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  
      @ViewChild('chart') chartRef?: ElementRef;

    chart?: Chart;

    @Input() data: ChartInfo | null = null;

    @Input() promedio: boolean = false;

    /**
     * `Observable` que emite eventos de actualización del `data`.
     *
     * Está pensado para forzar actualizaciones del `MatTableDataSource` de la tabla, desde el componente padre.
     */
    @Input() updateSource: Observable<boolean> | null = null;

  //private dataSourceSubscription?: Subscription;

  /** Alto del grafico. */
  @Input() height: string = '500';

  /** Ancho del grafico. */
    @Input() width: string = '500';

    calcProm (arr: any[]) : any[]{

        let sum: number = 0 ;
        let len : number = arr.length;
        let lapso: number = 1;//Moviendo este lapso se mueve la linea, se va sacando el promedio entre ese lapso de puntos
        let promedios: number[] = [];
        let sumLapso: number = 0;
        let countLapso: number = 0;
        let data_promedio: any[] = [];
        
        arr.forEach((elem: Inf, i: number) =>{
            sumLapso += elem.y;
            
        });
        const prom = sumLapso/ arr.length;
        let clone_prom = {...arr[0]};
        clone_prom.y = prom;
        data_promedio.push(clone_prom);
        clone_prom = {...arr[len-1]};
        clone_prom.y = prom;
        data_promedio.push(clone_prom);
        /* arr.map((elem: Inf, i: number) =>{
            elem.y = prom ;
            data_promedio.push(elem);
            
        }); */
       /*  arr.forEach((elem: Inf, i: number) =>{
            countLapso += 1;
            if(i == 0 || i == (len -1)){
                data_promedio.push(elem);
            }else{
                data_promedio.push(null);
            }
            if(i%lapso == 0){
                promedios.push(sumLapso/(countLapso == 0 ? 1 : countLapso));
                countLapso = 0;
                sumLapso = 0;
                sumLapso = elem.y;
                //sum1 =sum1 + v;
                //count1 = count1 + 1;
            }else{  
                sumLapso += elem.y;
                //sum2 =sum2 + v;
                //count2 = count2 + 1;
            }
            //console.log(v);
            sum += elem.y;
        });
        console.log(promedios, arr);
        

        promedios.forEach((elem: number, i: number) => {
            if(i > 0 && i <= (promedios.length -1)){
                console.log(i+lapso, data_promedio[i+lapso]);
                data_promedio[i+lapso].y = elem;
              }else{
                data_promedio[i].y = elem;
              }
        }); */
        
        return data_promedio;
    
    }

    /* graphClickEvent(event: ChartEvent, chart: ActiveElement[]){
        if(chart[0] && this.data?.data){
            let arr: Info[] = JSON.parse(JSON.stringify(this.data?.data));
            const selected: number = chart[0].datasetIndex;
            let len : number = arr.length;
            
            let promedio = {...arr[selected ?? 0]};
            promedio.label += ' (promedio)';
            arr = arr.filter(elem => !elem.label.includes(promedio.label))
            promedio.data = this.calcProm(promedio.data);
            console.log(promedio.data, arr);
            //this.data.data.push(promedio);
        }
    } */

    
    ngAfterViewInit(): void {
        if (this.updateSource) {
            
            
            //this.data!.data.push(...data_promedio);
            this.updateSource.subscribe((update) => {
                if(this.promedio){
                    let data_promedio: any[] = JSON.parse(JSON.stringify(this.data?.data));
                    data_promedio.map(elem =>{
                        let clone_prom = {...elem};
                        clone_prom.label += ' (promedio)';
                        clone_prom.backgroundColor = elem.borderColor;
                        clone_prom.borderColor = elem.backgroundColor;
                        clone_prom.data = this.calcProm(elem.data);
                        this.data!.data.push(clone_prom);
                    });
                }
                const information: any = {
                    type: <ChartType>this.data!.type,
                    data: {
                        datasets: this.data!.data,
                        labels: this.data!.labels,
                    },
                    options: {
                        //onClick: this.graphClickEvent.bind({calcProm: this.calcProm, data:this.data}),
                        /*onHover: function (evt, item) {
                            if (item.length) {
                                console.log("onHover", item, evt.type);
                                //console.log(">data", item[0]._index, data.datasets[0].data[item[0]._index]);
                            }
                        },*/
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: "time",
                                time: {
                                    unit: this.data!.period
                                },
                            },
                            y: {
                                beginAtZero: true,
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: this.data!.title,
                            },
                        },
                    }
                }
                
                this.chart?.destroy();
                this.chart = new Chart(this.chartRef?.nativeElement, information);
                this.chart?.update();
            });
        }
  }

  ngOnDestroy() {
    //this.dataSourceSubscription?.unsubscribe();
  }

  @Output() clickChart = new EventEmitter<Object>();


  constructor() {}

  // events
  chartClicked(event?: Event): void {
    this.clickChart.emit(event);
    //console.log(event, active);
  }

  /* chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  } */
}
