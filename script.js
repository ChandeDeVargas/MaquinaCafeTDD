class CoffeeMachine {
            constructor() {
                this.inventory = {
                    coffee: 100, // Oz
                    cups: 50,    // unidades
                    sugar: 200   // cucharadas
                };
                
                this.selectedSize = null;
                this.selectedOz = 0;
                this.sugarAmount = 0;
                
                this.initializeEventListeners();
                this.updateStatusDisplay();
            }

            initializeEventListeners() {
                // Selección de tamaño de vaso
                document.querySelectorAll('.cup-option').forEach(option => {
                    option.addEventListener('click', (e) => {
                        this.selectCupSize(e.currentTarget);
                    });
                });

                // Controles de azúcar
                document.getElementById('decreaseSugar').addEventListener('click', () => {
                    this.adjustSugar(-1);
                });

                document.getElementById('increaseSugar').addEventListener('click', () => {
                    this.adjustSugar(1);
                });

                // Botón de dispensar
                document.getElementById('dispenseBtn').addEventListener('click', () => {
                    this.dispenseCoffee();
                });
            }

            selectCupSize(option) {
                // Remover selección anterior
                document.querySelectorAll('.cup-option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                // Seleccionar nueva opción
                option.classList.add('selected');
                this.selectedSize = option.dataset.size;
                this.selectedOz = parseInt(option.dataset.oz);

                this.hideMessage();
            }

            adjustSugar(change) {
                const newAmount = this.sugarAmount + change;
                if (newAmount >= 0 && newAmount <= 10) {
                    this.sugarAmount = newAmount;
                    document.getElementById('sugarDisplay').textContent = this.sugarAmount;
                }
            }

            checkInventory() {
                const errors = [];

                if (this.inventory.coffee < this.selectedOz) {
                    errors.push('café insuficiente');
                }

                if (this.inventory.cups < 1) {
                    errors.push('vasos agotados');
                }

                if (this.inventory.sugar < this.sugarAmount) {
                    errors.push('azúcar insuficiente');
                }

                return errors;
            }

            dispenseCoffee() {
                // Validar selección de tamaño
                if (!this.selectedSize) {
                    this.showMessage('Por favor selecciona un tamaño de vaso', 'warning');
                    return;
                }

                // Verificar inventario
                const inventoryErrors = this.checkInventory();
                if (inventoryErrors.length > 0) {
                    this.showMessage(`Error: ${inventoryErrors.join(', ')}`, 'error');
                    return;
                }

                // Procesar dispensado
                this.processDispensing();
            }

            processDispensing() {
                const dispenseBtn = document.getElementById('dispenseBtn');
                
                // Deshabilitar botón y mostrar animación
                dispenseBtn.disabled = true;
                dispenseBtn.textContent = '☕ Preparando...';
                dispenseBtn.classList.add('dispensing');

                // Simular tiempo de dispensado
                setTimeout(() => {
                    // Actualizar inventario
                    this.inventory.coffee -= this.selectedOz;
                    this.inventory.cups -= 1;
                    this.inventory.sugar -= this.sugarAmount;

                    // Mostrar mensaje de éxito
                    this.showMessage(
                        `¡Café listo! ${this.selectedSize.toUpperCase()} (${this.selectedOz} Oz) con ${this.sugarAmount} cucharadas de azúcar`, 
                        'success'
                    );

                    // Actualizar display
                    this.updateStatusDisplay();
                    this.resetSelection();

                    // Restaurar botón
                    dispenseBtn.disabled = false;
                    dispenseBtn.textContent = '🚀 Dispensar Café';
                    dispenseBtn.classList.remove('dispensing');

                    // Añadir animación de café
                    this.showCoffeeAnimation();

                }, 2000);
            }

            showCoffeeAnimation() {
                const animation = document.createElement('div');
                animation.className = 'coffee-animation';
                animation.textContent = '☕';
                document.body.appendChild(animation);

                setTimeout(() => {
                    document.body.removeChild(animation);
                }, 2000);
            }

            resetSelection() {
                // Limpiar selección de vaso
                document.querySelectorAll('.cup-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                this.selectedSize = null;
                this.selectedOz = 0;
                
                // Resetear azúcar
                this.sugarAmount = 0;
                document.getElementById('sugarDisplay').textContent = '0';
            }

            updateStatusDisplay() {
                // Actualizar café
                const coffeeStatus = document.getElementById('coffeeStatus');
                coffeeStatus.textContent = `${this.inventory.coffee} Oz`;
                coffeeStatus.className = 'status-value ' + this.getStatusClass(this.inventory.coffee, 20, 50);

                // Actualizar vasos
                const cupsStatus = document.getElementById('cupsStatus');
                cupsStatus.textContent = `${this.inventory.cups} unid`;
                cupsStatus.className = 'status-value ' + this.getStatusClass(this.inventory.cups, 5, 15);

                // Actualizar azúcar
                const sugarStatus = document.getElementById('sugarStatus');
                sugarStatus.textContent = `${this.inventory.sugar} cdas`;
                sugarStatus.className = 'status-value ' + this.getStatusClass(this.inventory.sugar, 20, 50);
            }

            getStatusClass(value, lowThreshold, mediumThreshold) {
                if (value <= lowThreshold) return 'low';
                if (value <= mediumThreshold) return 'medium';
                return 'high';
            }

            showMessage(text, type) {
                const messageArea = document.getElementById('messageArea');
                messageArea.textContent = text;
                messageArea.className = `message ${type}`;
                messageArea.style.display = 'block';

                // Auto-ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    this.hideMessage();
                }, 5000);
            }

            hideMessage() {
                const messageArea = document.getElementById('messageArea');
                messageArea.style.display = 'none';
            }
        }

        // Inicializar la máquina de café cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            new CoffeeMachine();
        });