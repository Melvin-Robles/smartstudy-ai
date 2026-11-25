import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudyStore } from '../../core/study.store';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (document(); as item) {
      <div class="detail-page">
        <a class="back-link" routerLink="/documents"><i class="uil uil-arrow-left"></i> Volver a documentos</a>
        <div class="detail-heading"><div><div class="detail-title-line"><span class="file-icon large">{{ item.type }}</span><div><span class="eyebrow teal">DOCUMENTO LISTO</span><h1>{{ item.name }}</h1><p>{{ item.size }} | {{ item.pages }} páginas | Cargado {{ item.uploadedAt.toLowerCase() }}</p></div></div></div><div class="detail-actions"><button class="secondary-button" type="button"><i class="uil uil-download-alt"></i> Descargar</button><button class="icon-button danger" type="button" (click)="remove()" aria-label="Eliminar documento"><i class="uil uil-trash-alt"></i></button></div></div>
        <div class="detail-grid"><section class="panel summary-panel"><div class="panel-heading"><div><span class="eyebrow teal">RESUMEN GENERADO</span><h2>Lo esencial, en contexto</h2></div><span class="status-chip success">Trazable</span></div><div class="summary-callout"><span class="summary-mark"><i class="uil uil-brain"></i></span><p>{{ item.summary }}</p></div><h3>Ideas principales</h3><ol class="insight-list"><li><strong>La arquitectura define límites.</strong><span>La separación de responsabilidades permite que las reglas de negocio evolucionen sin depender de detalles externos.</span><small>Fuente: p. 4 | <a href="/documents/{{ item.id }}">Ver fragmento</a></small></li><li><strong>Los contratos reducen el acoplamiento.</strong><span>Las interfaces explícitas hacen que los adaptadores puedan cambiar sin modificar el dominio.</span><small>Fuente: p. 9 | <a href="/documents/{{ item.id }}">Ver fragmento</a></small></li><li><strong>La calidad se verifica continuamente.</strong><span>Las pruebas deben acompañar el ciclo de desarrollo y cubrir comportamiento, accesibilidad y seguridad.</span><small>Fuente: p. 15 | <a href="/documents/{{ item.id }}">Ver fragmento</a></small></li></ol></section><aside class="detail-side"><div class="panel artifact-panel"><span class="eyebrow">MATERIAL DE ESTUDIO</span><h2>Listo para practicar</h2><p>Este documento tiene material generado con referencia a su contenido fuente.</p><div class="artifact-row"><span class="artifact-icon teal-bg"><i class="uil uil-book-open"></i></span><div><strong>{{ cardsCount() }} flashcards</strong><small>Conceptos clave para repasar</small></div><a routerLink="/flashcards"><i class="uil uil-arrow-right"></i></a></div><a class="secondary-button full" routerLink="/flashcards">Practicar flashcards <i class="uil uil-arrow-right"></i></a></div><div class="panel trace-panel"><span class="eyebrow teal">TRAZABILIDAD</span><h3>Cómo se generó</h3><div class="trace-item"><span><i class="uil uil-check"></i></span><div><strong>Contenido extraído</strong><small>Texto normalizado del documento</small></div></div><div class="trace-item"><span><i class="uil uil-check"></i></span><div><strong>Fuente conservada</strong><small>Cada idea mantiene página y fragmento</small></div></div><div class="trace-item"><span><i class="uil uil-check"></i></span><div><strong>Validación estructurada</strong><small>Resultado verificado antes de mostrar</small></div></div></div></aside></div>
      </div>
    } @else {
      <div class="empty-state"><span><i class="uil uil-search"></i></span><h2>Documento no encontrado</h2><a routerLink="/documents" class="primary-button">Volver a documentos</a></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly study = inject(StudyStore);
  readonly document = computed(() => this.study.getDocument(this.route.snapshot.paramMap.get('id') || ''));
  readonly cardsCount = computed(() => this.study.flashcards().filter((card) => card.documentId === this.document()?.id).length);

  remove(): void {
    const id = this.document()?.id;
    if (id) { this.study.remove(id); window.location.assign('/documents'); }
  }
}
