//Carrega as configurações armazenas no localStorage
CONFIG=JSON.parse(localStorage.config);



$.waitFor=function(elemento, func, timeout=15000){
	var cont=0;
	var loopWait=setInterval(function(){
		if( $(elemento).size()==1){
			clearInterval(loopWait);
			func();
		}
		cont=+100;
		if (cont>=timeout) clearInterval(loopWait);
	},100);	
	
};





$(document).ready(function(){














unsafeWindow.bot={};

window.bot=bot;
bot.apostando_agora=false;



bot.stake=function(percent_da_banca){
	myBetsList=JSON.parse(localStorage['myBetsList']);
    
    var soma=0;
	$(myBetsList).each(function(){
		soma+=this.cash_out_return;		
	});
	soma+=bot.balance; 
    var stake_var=Number((soma*percent_da_banca).toFixed(2));
    if (stake_var<0.5) stake_var=0.5;
    
    return stake_var;
};

bot.jogoLive = function (home,away){
	var ahSel=function(selObj){
	   var arr_ah=selObj.find('.ip-Participant_OppName').text().split(',');

	   var s=0;
	   $(arr_ah).each(function(i,e){ s+=Number(e); });
	   return s/$(arr_ah).size();
	};	
   
	jogo=-1;
	$('div.ipe-ParticipantCouponFixtureName_Participant ').each(function(i,e){ 
		if( 
			($(e).find('.ipe-ParticipantCouponFixtureName_TeamName:eq(0)').html()==home)  && 
			($(e).find('.ipe-ParticipantCouponFixtureName_TeamName:eq(1)').html()==away )
		){
			//saida=i;
			jogo={
					market: $(e).parents('.ipe-Market')
			};
				   
		}		
		
	});
	if (jogo==-1) return jogo;
	
	jogo.selecoes=$(jogo.market).find('.ip-Participant ');
	jogo.numJogos=$(jogo.market).find('.ipe-ParticipantCouponFixtureName_Participant').size();
	
	$(jogo.market).find('.ipe-ParticipantCouponFixtureName_Participant').each(function(i,e){ 
		if( 
			($(e).find('.ipe-ParticipantCouponFixtureName_TeamName:eq(0)').html()==home)  && 
			($(e).find('.ipe-ParticipantCouponFixtureName_TeamName:eq(1)').html()==away )
		){
			jogo.positionInMarket=i;
			jogo.posSelsJogo=[jogo.positionInMarket, jogo.positionInMarket+jogo.numJogos];
			jogo.selHome=$(jogo.market).find('.ip-Participant').eq(jogo.posSelsJogo[0]);
			jogo.selAway=$(jogo.market).find('.ip-Participant').eq(jogo.posSelsJogo[1]);	
		}
	});
	jogo.tempo=Number($(jogo.market).find('.ipe-ParticipantCouponFixtureName_Timer').eq(jogo.positionInMarket).text().split(':')[0]);
	
	jogo.gH_atual=Number($(jogo.market).find('.ipe-ParticipantCouponFixtureName_Team1Score').eq(jogo.positionInMarket).text());
	jogo.gA_atual=Number($(jogo.market).find('.ipe-ParticipantCouponFixtureName_Team2Score').eq(jogo.positionInMarket).text());
	
	jogo.AH_Home=ahSel(jogo.selHome);
	jogo.AH_Away=ahSel(jogo.selAway);
	
	jogo.odds_Over=Number(jogo.selHome.find('.ip-Participant_OppOdds').text()); 
	jogo.odds_Under=Number(jogo.selAway.find('.ip-Participant_OppOdds').text()); 
	
	
	return jogo;
};

bot.jaFoiApostado=function(home,away){
	myBetsList=JSON.parse(localStorage['myBetsList']);
	
	var retorno=false;
	$(myBetsList).each(function(){		
		if ( (this.match==home+' v '+away) && (this.mercado.includes('Goal Line'))    )  retorno=true;
		
	});
	return retorno;
	
    

};




bot.digitaStake=function(valor){
	if( $('.qb-Keypad').size()==0 ) $('.qb-StakeBox').click();
	$.waitFor('.qb-Keypad',function(){
		var delay=0;
		for(var i=1; i<=8; i++ ) $('.qb-Keypad_Delete').click();
		
		var lista_teclas=(''+valor).split('');
		lista_teclas.push('Done');
		
		$(lista_teclas).each(function(i,e){
			delay=10+i*50;
			setTimeout(function(){
				$('.qb-KeypadButton:contains('+e+') ').click();
			},delay);
		});
		delay+=100;
		setTimeout(function(){
			$('.qb-PlaceBetButton').click();
			$.waitFor('.qb-PlaceBetButton:contains(Refer)',function(){
				$('.qb-PlaceBetButton').click();
			});
		},delay);	
	});
}

bot.apostar=function(selObj, percent_da_banca){ 
	bot.apostando_agora=true;
	selObj.click();
	$.waitFor('.qb-StakeBox', function(){
        //Usa os creditos
        if( $('.qb-UseBetCredits_CheckBox:not(.qb-UseBetCredits_CheckBox-selected)').size()>0 ) $('.qb-UseBetCredits_CheckBox').click();
		bot.digitaStake(bot.stake(percent_da_banca));
	});

};







//---Toda vez que as estatisticas do arquivo JSON forem carregadas
bot.onLoadStats=function(response){

   bot.apostando_agora=false;
   //bot.lista_de_apostas=[];
   

   var jogos=eval(response);


   //Se o flag bot.apostando_agora estiver true, não tenta aposta
   //if(bot.apostando_agora) return;
    
    
    var anota_apostas=[];
   //Para jogo no cupom
   
   //bot.fila_de_apostas=[];

   $('.ipe-ParticipantCouponFixtureName_Participant').each(function(i,e){

	   var home=$(e).find('.ipe-ParticipantCouponFixtureName_TeamName:eq(0)').text();
	   var away=$(e).find('.ipe-ParticipantCouponFixtureName_TeamName:eq(1)').text();
	   

	   $(jogos).each(function(ii,jogo){			   
			 if (bot.apostando_agora) return;
		   
			 if(  (ns(jogo.home)==ns(home)) && (ns(jogo.away)==ns(away)) ){
				   
                   //console.log(jogo.tempo);
				   //Se a aba myBets não foi atualiza nos últimos 2 segundos sai;
				   if( ( +new Date() ) - Number(localStorage.myBetsLastUpdate) >2000) return;
				   
				   //Senão estiver no half time sai
                   if( jogo.time != 'half') return;   
                     
                  
                   //Se quase não tiver ataque perigosos sai, porque pode ser um jogo com erro nos dados
                   if( (jogo.daHf+jogo.daAf )<5) return;  
                                   
                   //Se já houve aposta nesse jogo sai.
				   if( bot.jaFoiApostado(home,away) ) return;   
                   
				   
                   
				   //Se o elemento DOM da linha do jogo 
				   jogo_selecionado=bot.jogoLive(home,away);
                   
                   if( jogo_selecionado.tempo != 45) return; 
                   
					j=jogo;
                    j_sel=jogo_selecionado;
                    
					//Aposta no Under
					goalline=jogo_selecionado.AH_Away;
                    
                     var probUnder=1.0/j_sel.odds_Under/(1.0/j_sel.odds_Under + 1.0/j_sel.odds_Over);
		
               
                    s_g=j.gh+j.ga;
                    s_c=j.ch+j.ca;
                    s_da=j.dah+j.daa;
                    s_s=j.sh+j.sa;
                    d_g=Math.abs(j.gh-j.ga);
                    d_c=Math.abs(j.ch-j.ca);
                    d_da=Math.abs(j.dah-j.daa);
                    d_s=Math.abs( j.sh-j.sa);
					s_r=j.rh+j.ra;
                    goal=goalline;
                    goal_diff=goalline-s_g;
                    oddsU=1.0*j_sel.odds_Under;
					oddsO=1.0*j_sel.odds_Over;
                    probU=probUnder;
                    probU_diff=Math.abs( probUnder-0.5 );
                    mod0=Number(goalline%1==0);
                    mod25=Number(goalline%1==0.25);
                    mod50=Number(goalline%1==0.50);
                    mod75=Number(goalline%1==0.75);
                    
        
                    eval(localStorage.FORMULA2);
	

				   plU_por_odds=plU_por_odds/variancias[ mod0 ? 'u00': (mod25 ? 'u25': (mod50 ? 'u50': 'u75'))];
				   
				   plO_por_odds=plO_por_odds/variancias[ mod0 ? 'o00': (mod25 ? 'o25': (mod50 ? 'o50': 'o75'))];
				   
				   
                   console.log([home, away, plU_por_odds, plO_por_odds]);
                    

                    //Se o não atingir o indice mínimo não aposta
                    //if( (plU_por_odds <  CONFIG.minimo_indice_para_apostar) && (plO_por_odds <  CONFIG.minimo_indice_para_apostar)	  ) return;
                    
                    if (plO_por_odds >=  CONFIG.minimo_indice_para_apostar) {
						var percent_da_banca=plO_por_odds * CONFIG.percentual_de_kelly;                    
						if (percent_da_banca >  CONFIG.maximo_da_banca_por_aposta) percent_da_banca=CONFIG.maximo_da_banca_por_aposta;
                    
						//bot.fila_de_apostas.push( { 'sel_odds': jogo_selecionado.selHome, 'percent_da_banca':  percent_da_banca, 'home_away': home+' v '+away }  );
						bot.apostar(jogo_selecionado.selHome, percent_da_banca );
						return;
					}	
					

                    if (plU_por_odds >= CONFIG.minimo_indice_para_apostar) {
						var percent_da_banca=plU_por_odds * CONFIG.percentual_de_kelly;                    
						if (percent_da_banca >  CONFIG.maximo_da_banca_por_aposta) percent_da_banca=CONFIG.maximo_da_banca_por_aposta;
                    
						//bot.fila_de_apostas.push( { 'sel_odds': jogo_selecionado.selAway, 'percent_da_banca':  percent_da_banca, 'home_away': home+' v '+away }  );
						bot.apostar(jogo_selecionado.selAway, percent_da_banca );
						return;
                    }
					
				
					
					
			 }
             
             
	   });
   });



   
   
};  





//---A cada 30 segundos
setInterval(function(){		
    console.log('on30segs');
     


    //Faz um ajax para o arquivo JSONP "http://aposte.me/live/stats.js  que executará a função bot.onLoadStats()"
    $.getScript(localStorage.bot365_new==='1'? 'https://bot-ao.com/stats_new.3.18.js' : 'https://bot-ao.com/stats.3.18.js', function(){
        bot.onLoadStats(localStorage.stats);
        //Pega o valor da banca disponível
        $.get('https://mobile.365sport365.com/balanceservice/balanceservicehandler.ashx?rn='+(+new Date()),function(res){ 
            bot.balance=Number(res.split('$')[2]); 
        });
        
    });
         
    

   
},30000);





//Loop Principal repete todos os comandos a cada 1 segund
unsafeWindow.setInterval(function(){
	
	//Senão estiver logado, loga
	login();
	
	//Se não tiver nos Coupon de Asian Handicap sai fora
	if ( !primeiroTempo() && !segundoTempo() ) return;
	
	//Se não tiver no GoalLine clica no GoalLine
	if(!$('.ipe-MarketSelectorBar_Btn:contains(Goal Line)').hasClass('ipe-MarketSelectorBar_Selected') ) $('.ipe-MarketSelectorBar_Btn:contains(Goal Line)').click();
	
	CONFIG=JSON.parse(localStorage.config);
    

	//Abre os mercados colapsados
	$('.ipe-Market:not(:has(.ipe-MarketContainer ))').each(function(i,e){ $(e).click() })
	//bot.interativo();
	
	
	//Se o quickBet fica em suspenso, não se pode apostar e clica no Cancel X, para fechar o
	if( $('.qb-QuickBetModule').hasClass('qb-QuickBetModule_ChangeSuspended') ) $('.qb-MessageContainer_IndicationMessage:contains(Cancel)').click();
	if( $('.qb-QuickBetModule').hasClass('qb-QuickBetModule_PlacedNoneAus') )  $('.qb-MessageContainer_IndicationMessage:contains(Cancel)').click();
	if( $('.qb-QuickBetModule').hasClass('qb-QuickBetModule_ChangeOdds') ) $('.qb-PlaceBetButton ').click();
	
    if( $('.qb-QuickBetModule').hasClass('qb-QuickBetModule_PlaceBetFailed') )  {
		if ( ($('.qb-Header_MainText:contains("available maximum")').size()>0) ){
			var stake_max=Number( $('.qb-Header_MainText:contains("available maximum")').text().split('of ')[1] );
			if (stake_max>0) {
				bot.digitaStake(stake_max);
			}
			else{
				$('.qb-MessageContainer_IndicationMessage:contains(Cancel)').click();
			}
		}
		else {
			$('.qb-MessageContainer_IndicationMessage:contains(Cancel)').click();	
		}
	}

},2000);







//A cada 15 minutos recarrega a pagina
window.setInterval(function(){
    window.location.reload();
},15*60*1000);


});
