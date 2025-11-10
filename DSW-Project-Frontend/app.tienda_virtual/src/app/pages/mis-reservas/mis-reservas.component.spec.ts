import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisReservasComponent } from './mis-reservas.component';
import { ReservaService } from '../../services/reserva.service';
import { LoginService } from '../../services/login.service';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ReservaModel } from '../../models/reserva.model';
import { CommonModule } from '@angular/common';

describe('MisReservasComponent', () => {
  let component: MisReservasComponent;
  let fixture: ComponentFixture<MisReservasComponent>;
  let mockReservaService: jasmine.SpyObj<ReservaService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let userDataSubject: BehaviorSubject<any>;

  // Mock data
  const mockReservas: ReservaModel[] = [
    {
      id: 1,
      fecha_reserva: '2025-11-10T10:00:00',
      estado: 'confirmada',
      precio: 5000,
      publicacion_id: 1,
      cliente_id: 1,
      publicacion: {
        id: 1,
        titulo: 'Clases de programación',
        descripcion: 'Clases particulares de JavaScript',
        precio: 5000,
        servicio_id: 1,
        usuario_id: 2,
        servicio: {
          id: 1,
          nombre: 'Educación',
          emoji: '📚'
        },
        usuario: {
          id: 2,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com'
        }
      }
    },
    {
      id: 2,
      fecha_reserva: '2025-11-09T15:30:00',
      estado: 'pendiente',
      precio: 3000,
      publicacion_id: 2,
      cliente_id: 1,
      publicacion: {
        id: 2,
        titulo: 'Reparación de computadoras',
        descripcion: 'Servicio técnico especializado',
        precio: 3000,
        servicio_id: 2,
        usuario_id: 3,
        servicio: {
          id: 2,
          nombre: 'Tecnología',
          emoji: '💻'
        },
        usuario: {
          id: 3,
          nombre: 'María',
          apellido: 'González',
          email: 'maria@example.com'
        }
      }
    }
  ];

  beforeEach(async () => {
    // Create spy objects for services
    mockReservaService = jasmine.createSpyObj('ReservaService', ['misreservas']);
    
    userDataSubject = new BehaviorSubject({ id: 1, nombre: 'Test User' });
    mockLoginService = jasmine.createSpyObj('LoginService', [], {
      currentUserData: userDataSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [MisReservasComponent, CommonModule],
      providers: [
        { provide: ReservaService, useValue: mockReservaService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MisReservasComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores por defecto', () => {
    expect(component.reservas).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.errorMsg).toBe('');
  });

  describe('cargarReservas', () => {
    it('debería cargar las reservas exitosamente', (done) => {
      mockReservaService.misreservas.and.returnValue(
        of({ data: mockReservas })
      );

      component.cargarReservas();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(component.reservas.length).toBe(2);
        expect(component.reservas[0].publicacion?.titulo).toBe('Clases de programación');
        expect(component.errorMsg).toBe('');
        done();
      }, 100);
    });

    it('debería manejar error al cargar reservas', (done) => {
      mockReservaService.misreservas.and.returnValue(
        throwError(() => new Error('Error de red'))
      );

      component.cargarReservas();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(component.reservas.length).toBe(0);
        expect(component.errorMsg).toBe('Error al cargar tus reservas.');
        done();
      }, 100);
    });

    it('debería mostrar error si el usuario no está logueado', (done) => {
      userDataSubject.next(null);

      component.cargarReservas();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(component.errorMsg).toBe('Debes iniciar sesión.');
        expect(mockReservaService.misreservas).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('debería activar loading al cargar reservas', () => {
      mockReservaService.misreservas.and.returnValue(
        of({ data: mockReservas })
      );

      expect(component.loading).toBe(false);
      component.cargarReservas();
      expect(component.loading).toBe(true);
    });
  });

  describe('getEstadoClass', () => {
    it('debería retornar "estado-confirmada" para estado confirmada', () => {
      expect(component.getEstadoClass('confirmada')).toBe('estado-confirmada');
      expect(component.getEstadoClass('Confirmada')).toBe('estado-confirmada');
      expect(component.getEstadoClass('CONFIRMADA')).toBe('estado-confirmada');
    });

    it('debería retornar "estado-pendiente" para estado pendiente', () => {
      expect(component.getEstadoClass('pendiente')).toBe('estado-pendiente');
      expect(component.getEstadoClass('Pendiente')).toBe('estado-pendiente');
    });

    it('debería retornar "estado-cancelada" para estado cancelada', () => {
      expect(component.getEstadoClass('cancelada')).toBe('estado-cancelada');
      expect(component.getEstadoClass('Cancelada')).toBe('estado-cancelada');
    });

    it('debería retornar string vacío para estado desconocido', () => {
      expect(component.getEstadoClass('otro')).toBe('');
      expect(component.getEstadoClass('')).toBe('');
    });
  });

  describe('ngOnInit', () => {
    it('debería llamar a cargarReservas al inicializar', () => {
      spyOn(component, 'cargarReservas');
      component.ngOnInit();
      expect(component.cargarReservas).toHaveBeenCalled();
    });
  });

  describe('Renderizado de template', () => {
    it('debería mostrar spinner cuando está cargando', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const spinner = fixture.nativeElement.querySelector('.spinner');
      const loadingText = fixture.nativeElement.querySelector('.loading-text');
      
      expect(spinner).toBeTruthy();
      expect(loadingText?.textContent).toContain('Cargando tus reservas');
    });

    it('debería mostrar mensaje de error cuando hay error', () => {
      component.loading = false;
      component.errorMsg = 'Error de prueba';
      fixture.detectChanges();
      
      const errorAlert = fixture.nativeElement.querySelector('.alert-error');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert?.textContent).toContain('Error de prueba');
    });

    it('debería mostrar empty state cuando no hay reservas', () => {
      component.loading = false;
      component.errorMsg = '';
      component.reservas = [];
      fixture.detectChanges();
      
      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState?.textContent).toContain('No tienes reservas aún');
    });

    it('debería mostrar las reservas cuando hay datos', () => {
      mockReservaService.misreservas.and.returnValue(
        of({ data: mockReservas })
      );
      
      component.loading = false;
      component.reservas = mockReservas;
      fixture.detectChanges();
      
      const cards = fixture.nativeElement.querySelectorAll('.publication-card');
      expect(cards.length).toBe(2);
    });

    it('debería mostrar el título correcto en las tarjetas', () => {
      component.loading = false;
      component.reservas = mockReservas;
      fixture.detectChanges();
      
      const titles = fixture.nativeElement.querySelectorAll('.card-title');
      expect(titles[0]?.textContent).toContain('Clases de programación');
      expect(titles[1]?.textContent).toContain('Reparación de computadoras');
    });

    it('debería mostrar el emoji del servicio', () => {
      component.loading = false;
      component.reservas = mockReservas;
      fixture.detectChanges();
      
      const emojis = fixture.nativeElement.querySelectorAll('.service-emoji');
      expect(emojis[0]?.textContent).toContain('📚');
      expect(emojis[1]?.textContent).toContain('💻');
    });

    it('debería aplicar la clase correcta según el estado', () => {
      component.loading = false;
      component.reservas = mockReservas;
      fixture.detectChanges();
      
      const badges = fixture.nativeElement.querySelectorAll('.card-badge');
      expect(badges[0]?.classList.contains('estado-confirmada')).toBe(true);
      expect(badges[1]?.classList.contains('estado-pendiente')).toBe(true);
    });
  });
});
