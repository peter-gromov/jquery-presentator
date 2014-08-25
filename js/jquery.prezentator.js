/**
* jQuery Prezentator v 0.1 // Задание для Яндекса
* ===============================================
* Плагин для вывода презентации
* @author Petr Gromov <petergromov@ya.ru>
*
* На разработку всего решения ушло суммарно 5 часов.
*/

(function ( $ ) {

	var presentations = {};


 	/**
 	* Функция для сбора картинок из ul
 	* images - попавшие в ul картинки
 	*/
    var construnctPresentationStack = function(images){
    	var presentationStack = {};

    	images.each(function(i, e){
    		presentationStack[i] = e;
    	});

    	return presentationStack;
    };





 	/**
 	* Проставляем слайд без анимации (нужно при загрузке)
 	* slider - объект слайдера
 	* slideNo  - индекс слайда из бара со слайдами, который надо установить
 	*/

 	var setSlide = function(slider, slideNo){
 		var slide = slider.find('.prezentator-slide').eq(slideNo),
 			slides =  slider.find('.prezentator-slide'),
 			reciever = slider.find('.prezentator-container-back'),
 			src = slide.find('img').attr('src'),
 			recieverImg = reciever.find('img');

 		recieverImg.attr('src', src );
 		slides.removeClass('active');
 		slide.addClass('active');

 	};





 	/**
 	* Функция смены слайда для слайдера
 	* slider - объект слайдера
 	* slideNo - индекс слайда из бара со слайдами, на который надо поменять
 	*/
 	var changeSlide = function(slider, slideNo){
 		var slide = slider.find('.prezentator-slide').eq(slideNo),
 			slides =  slider.find('.prezentator-slide'),
 			recieverBack = slider.find('.prezentator-container-back'),
 			recieverFront = slider.find('.prezentator-container-front'),
 			src = slide.find('img').attr('src');

 		//todo деградация опасити
 		recieverFront.hide();
 		recieverFront.find('img').attr('src', src);
 		recieverBack.fadeOut();
 		recieverFront.fadeIn(function(){
 			recieverBack.find('img').attr('src', src);
 			recieverBack.show();
 			recieverFront.hide();
 		});

		slides.removeClass('active');
		slide.addClass('active'); 	
 	};





 	/**
 	* Выбрать следующий слайд
 	* slider - объект слайдера
 	*/
 	var changeSlideNext = function(slider){
 		var slides =  slider.find('.prezentator-slide'),
 			activeSlide = slider.find('.prezentator-slide.active'),
 			nextSlide;
 		if( activeSlide.next().length   != 0)	{
 			nextSlide = activeSlide.next();
 			changeSlide(slider, nextSlide.index());
 		}
 	};





 	/**
 	* Выбрать предыдущий слайд
 	* slider - объект слайдера
 	*/
 	var changeSlidePrev = function(slider){
 		var slides =  slider.find('.prezentator-slide'),
 			activeSlide = slider.find('.prezentator-slide.active'),
 			prevSlide;

 		if(  activeSlide.prev().length  != 0)	{
 			prevSlide = activeSlide.prev();
 			changeSlide(slider, prevSlide.index()); 			
 		}
 	};





 	/**
 	* Запуск таймера переключения слайдов с определённой скростью
 	* slider - объект слайдера
 	* speed - скорость добавления
 	*/
 	var startSliding = function(slider, speed){
 	
 		return setInterval(function(){
 			if( !slider.hasClass('paused') ){
 				changeSlideNext(slider);	
 			}
 		}, speed);
 	};





 	/**
 	* Приостанавливаем слайдинг презентации
 	* slider - объект слайдера
 	*/
 	var pauseSliding = function(slider){
 		slider.addClass('paused');
 	};





 	/**
 	* Продолжаем слайдинг
 	* slider - объект слайдера
 	*/
 	var continueSliding = function(slider){
 		slider.removeClass('paused');
 	};





 	/**
 	* Заполняет слайдами бар со слайдами
 	* container - куда добавить слайд
 	* img - картинка из ДОМ, какую надо добавить
 	*/
 	var addSlide = function(container, img){
 		var slideBaseHTML = '<div class="prezentator-slide"><div class="prezentator-slide-img"><img src="" alt="" class="prezentator-slide-img-img"></div></div>',
 			slide = $(slideBaseHTML);

 		if( typeof container == 'string'){
 			container = $(container);
 		}

 		slide.find('img').attr('src', $(img).attr('src'));
 		container.append(slide);
 	};





 	/**
 	* Скроллим налево
 	* slider - объект слайдера
 	*/
 	var scrollSlideBarLeft = function(slider){
 		var sliderWrapper = slider.find('.prezentator-slides-wrapper'),
 			sliderContainer = slider.find('.prezentator-slides-wrapper-container'),
 			sliderWidth = sliderWrapper.width(),
 			deltaToScroll = (sliderWidth / 3),		
 			max = 0,
			availableDelta = 0;

			slider.find('.prezentator-slide').each(function(i,e){ max += $(e).width(); });
			max = max - sliderWidth;

			if( parseInt(sliderContainer.css('margin-left')) > -1*max ) {
				sliderContainer.stop(true,true).animate({'margin-left' : '-='+deltaToScroll+'px'});
			}else{
				sliderContainer.css({'margin-left' : '-'+ (-1*max) +'px'});
			}
			

 	};





 	/**
 	* Скроллим налево
 	* slider - объект слайдера
 	*/
 	var scrollSlideBarRight = function(slider){
 		var sliderWrapper = slider.find('.prezentator-slides-wrapper'),
 			sliderContainer = slider.find('.prezentator-slides-wrapper-container'),
 			sliderWidth = sliderWrapper.width(),
 			deltaToScroll = (sliderWidth / 3),		
			availableDelta = 0;

			if( parseInt(sliderContainer.css('margin-left')) < 0) {
				sliderContainer.stop(true,true).animate({'margin-left' : '+='+deltaToScroll+'px'});	
			}else{
				sliderContainer.css({'margin-left' : '0px'});	
			}
			

 	};





 	/**
 	* Сам плагин Prezentator
 	* data - набор параметров
 	*/
    $.fn.prezentator = function(data) {

    	//Var definition 
    	var tSettings,
    		images = this.find('li img'),
    		presentationStack = construnctPresentationStack(images),
    		sliderBaseHTML = '<div class="prezentator-viewport"><div class="prezentator-arrow prezentator-arrow-right"></div><div class="prezentator-arrow prezentator-arrow-left"></div><div class="prezentator-container"><div class="prezentator-container-front"><img src="" alt=""></div><div class="prezentator-container-back"><img src="" alt=""></div></div><div class="prezentator-slides"><div class="prezentator-slides-arrow prezentator-slides-arrow-left"></div><div class="prezentator-slides-arrow prezentator-slides-arrow-right"></div><div class="prezentator-slides-wrapper"><div class="prezentator-slides-wrapper-container"></div></div></div></div>',
    		slideBaseHTML = '<div class="prezentator-slide"><div class="prezentator-slide-img"><img src="" alt="" class="prezentator-slide-img-img"></div></div>',


    		slider = $(sliderBaseHTML),
    		slidesWrapper = slider.find('.prezentator-slides-wrapper-container'),
    		slidesWrapperLeft = slider.find('.prezentator-slides-arrow-left'),
    		slidesWrapperRight = slider.find('.prezentator-slides-arrow-right'),
    		slidesRight = slider.find('.prezentator-arrow-right'),
    		slidesLeft = slider.find('.prezentator-arrow-left'),
    		slideFront = slider.find('.prezentator-container-front'),
    		slideBack = slider.find('.prezentator-container-back'),
    		slides;

    	//Settings we got fron call
    	if(typeof data == 'undefined') {
    		tSettings = {
				width: 700,
				height: 400,
				speed: 5000,
				startOnLoad: true,
				first: 1
			};
    	}else{
    		tSettings = {
				width: 700,
				height: 400,
				speed: 5000,
				startOnLoad: true,
				first: 1
			};

			for(var k in data){
				tSettings[k] = data[k];
			}

    	}


    	//Saving presentations to stack
    	presentations[ this.selector ] = {};
		presentations[ this.selector ].images = presentationStack;
		presentations[ this.selector ].settings = tSettings;
		

		console.log(presentationStack);

		//Filling Slider With Data

		slider.css('width', tSettings.width);
		slider.css('height', tSettings.height);

		for( var k in presentationStack ){
			addSlide(slidesWrapper, presentationStack[k]);
		}
		setSlide(slider,  tSettings.first - 1);
		slides = slider.find('.prezentator-slide');




		//Binding Actions

		//Переключение слайдов
		slides.bind("click", function(){
			changeSlide(slider, $(this).index());
		});
		slidesRight.bind("click", function(){
			changeSlideNext(slider);
		});
		slidesLeft.bind("click", function(){
			changeSlidePrev(slider);
		});

		slidesWrapperLeft.bind("click", function(){
			scrollSlideBarRight(slider);
		});
		slidesWrapperRight.bind("click", function(){
			scrollSlideBarLeft(slider);
		});

		//Задержка
		slider.bind("mouseenter", function(){ pauseSliding(slider); });
		slider.bind("mouseleave", function(){ continueSliding(slider); });




		//Выводим слайдер
		this.after(slider);
		//scrollSlideBarLeft(slider);

		//Запускаем слайдинг
		if( tSettings.startOnLoad ){
			presentations[ this.selector ].interval = startSliding(slider, tSettings.speed);	
		}
		

        this.hide();
        return this;
    };

 
}( jQuery ));

/**
* @todo - зацикливание (при переходе к последнему - переходить к первому)
* @todo - скроллить слайдбар за активным слайдом (когда автоматически переключается)
* @todo - поддержка .pptx - подумать как?
* @todo - поддержка html-слайдов
* @todo - поправить кое-где размеры
* @todo - тест кроссбраузерности (IE один раз вылетел)
*/